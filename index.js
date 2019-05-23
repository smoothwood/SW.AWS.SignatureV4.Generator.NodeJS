var moment = require("moment");
var crypto = require("crypto");
var utf8 = require("utf8");
exports.generate_signv4_mqtt = function (iot_host, iot_region, access_key, secret_key) {
    var method = "GET";
    var service = "iotdevicegateway";
    var host = iot_host;
    var region = iot_region;
    var canonical_uri = "/mqtt";
    var algorithm = "AWS4-HMAC-SHA256";
    var t = moment.utc();
    var amzdate = t.format("YYYYMMDDTHHmmss") + "Z";
    var datestamp = t.format("YYYYMMDD");
    var credential_scope = datestamp + "/" + region + "/" + service + "/" + "aws4_request";
    var canonical_querystring = "X-Amz-Algorithm=" + algorithm +
        "&X-Amz-Credential=" + encodeURIComponent(access_key + "/" + credential_scope) +
        "&X-Amz-Date=" + amzdate +
        "&X-Amz-SignedHeaders=host";
    var canonical_headers = "host:" + host + "\n";
    var payload_hash = crypto.createHash("sha256").update(utf8.encode("")).digest("hex");
    var canonical_request = method + "\n" + canonical_uri + "\n" + canonical_querystring + "\n" + canonical_headers + "\nhost\n" + payload_hash;
    var string_to_sign = algorithm + "\n" + amzdate + "\n" + credential_scope + "\n" + crypto.createHash("sha256").update(utf8.encode(canonical_request)).digest("hex");
    var signing_key = getSignatureKey(secret_key, datestamp, region, service);
    var signature = crypto.createHmac("sha256", signing_key).update(utf8.encode(string_to_sign)).digest("hex");
    var signed_url = 'wss://' + host + canonical_uri + '?' + canonical_querystring + '&X-Amz-Signature=' + signature
    console.log(signed_url);
    return signed_url
}

function getSignatureKey(key, dateStamp, regionName, serviceName) {
    var kDate = crypto.createHmac('sha256', utf8.encode("AWS4" + key)).update(dateStamp).digest();
    var kRegion = crypto.createHmac('sha256', kDate).update(regionName).digest();
    var kService = crypto.createHmac('sha256', kRegion).update(serviceName).digest();
    var kSigning = crypto.createHmac('sha256', kService).update("aws4_request").digest();
    return kSigning;
}

