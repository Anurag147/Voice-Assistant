using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Net.Http.Headers;

namespace WebApplication1
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpeechController : ControllerBase
    {
        private readonly IConfiguration _conf;
        public SpeechController(IConfiguration conf)
        {
              
            _conf = conf;
        }
        [Route("generatetoken")]
        public TokenObj GenerateToken()
        {
            string key = _conf.GetValue<string>("AzureSpeech:Key");
            string speechRegion = _conf.GetValue<string>("AzureSpeech:Region");
            TokenObj tokenObj = new TokenObj();

            using (var httpClient = new HttpClient())
            {
                var uri = new Uri($"https://{speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken");
                httpClient.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key",key);
                var resp = httpClient.PostAsync(uri,null).Result;
                var responseString = resp.Content.ReadAsStringAsync().Result;
                tokenObj.Token = responseString;
                tokenObj.Region=speechRegion;
            }
            return tokenObj;
        }
    }
}
