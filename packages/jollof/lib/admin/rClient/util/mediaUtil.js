exports.isVideo = (urlParam, mime) => {

    if (mime && mime.indexOf('video') > -1) return true;
    if (!urlParam) return false;

    var url = urlParam.toLowerCase();

    return url.endsWith('.mp4') ||
        url.endsWith('.3gp') ||
        url.endsWith('.mov') ||
        url.endsWith('.flv') ||
        url.endsWith('.wmv') ||
        url.indexOf('youtube.com') > -1

}

exports.isImage = (urlParam, mime) => {

    if (mime && mime.indexOf('image') > -1) return true;
    if (!urlParam) return false;

    var url = urlParam.toLowerCase();

    return url.endsWith('.jpg') ||
        url.endsWith('.jpeg') ||
        url.endsWith('.png') ||
        url.endsWith('.gif') ||
        url.endsWith('.bmp') ||
        url.endsWith('.webp') ||
        url.endsWith('.svg') ||
        url.endsWith('.tiff')

}


