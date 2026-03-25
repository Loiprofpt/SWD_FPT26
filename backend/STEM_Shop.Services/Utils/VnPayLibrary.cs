using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Globalization;

namespace STEM_Shop.Services.Utils
{
    public class VnPayLibrary
    {
        private readonly SortedDictionary<string, string> _requestData = new SortedDictionary<string, string>(StringComparer.Ordinal);
        private readonly SortedDictionary<string, string> _responseData = new SortedDictionary<string, string>(StringComparer.Ordinal);

        public void AddRequestData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _requestData[key] = value;
            }
        }

        public void AddResponseData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _responseData[key] = value;
            }
        }

        public string CreateRequestUrl(string baseUrl, string vnp_HashSecret)
        {
            var data = new StringBuilder();
            foreach (var kv in _requestData)
            {
                if (!string.IsNullOrEmpty(kv.Value))
                {
                    data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
                }
            }

            string queryString = data.ToString();
            if (queryString.Length > 0)
            {
                queryString = queryString.Remove(queryString.Length - 1, 1);
            }

            string vnp_SecureHash = HmacSHA512(vnp_HashSecret, queryString);

            return $"{baseUrl}?{queryString}&vnp_SecureHashType=HmacSHA512&vnp_SecureHash={vnp_SecureHash}";
        }

        public bool ValidateSignature(string inputHash, string secretKey)
        {
            var signData = BuildSignData(_responseData);
            var secureHash = HmacSHA512(secretKey, signData);
            return secureHash.Equals(inputHash, StringComparison.OrdinalIgnoreCase);
        }
        
        public void LoadFromQuery(IQueryCollection query)
        {
            foreach (var (key, value) in query)
            {
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    AddResponseData(key, value.ToString());
                }
            }
        }

        private static string BuildQueryString(SortedDictionary<string, string> data)
        {
            var sb = new StringBuilder();
            foreach (var kv in data)
            {
                if (string.IsNullOrEmpty(kv.Value))
                {
                    continue;
                }

                if (sb.Length > 0)
                {
                    sb.Append('&');
                }

                sb.Append(Rfc3986Encode(kv.Key));
                sb.Append('=');
                sb.Append(Rfc3986Encode(kv.Value));
            }

            return sb.ToString();
        }

        private static string BuildSignData(SortedDictionary<string, string> data)
        {
            var sb = new StringBuilder();
            foreach (var kv in data)
            {
                if (string.IsNullOrEmpty(kv.Value))
                {
                    continue;
                }

                if (string.Equals(kv.Key, "vnp_SecureHash", StringComparison.OrdinalIgnoreCase)
                    || string.Equals(kv.Key, "vnp_SecureHashType", StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                if (sb.Length > 0)
                {
                    sb.Append('&');
                }

                sb.Append(Rfc3986Encode(kv.Key));
                sb.Append('=');
                sb.Append(Rfc3986Encode(kv.Value));
            }

            return sb.ToString();
        }

        private static string Rfc3986Encode(string input)
        {
            // WebUtility.UrlEncode uses '+' for spaces; VNPAY expects %20.
            // Use Uri.EscapeDataString then normalize to uppercase hex.
            var escaped = Uri.EscapeDataString(input ?? string.Empty);
            return escaped;
        }

        private string HmacSHA512(string key, string inputData)
        {
            var hash = new StringBuilder();
            byte[] keyBytes = Encoding.UTF8.GetBytes(key);
            byte[] inputBytes = Encoding.UTF8.GetBytes(inputData);
            using (var hmac = new HMACSHA512(keyBytes))
            {
                byte[] hashValue = hmac.ComputeHash(inputBytes);
                foreach (var theByte in hashValue)
                {
                    hash.Append(theByte.ToString("x2"));
                }
            }
            return hash.ToString();
        }
    }
}
