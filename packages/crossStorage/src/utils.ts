export function handleGetGuuid() {
    return 'xxxxxxxx-xxxx-sparks-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

function updateQueryStringParameter(uri: string, key: string, value: string) {
    if (!value) {
        return uri;
    }
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        return uri + separator + key + "=" + value;
    }
}

export const handleGetUpdateUrl = (url: string, uuid: string): string => {
    return updateQueryStringParameter(url, 'sparkCrossId', uuid)
}

