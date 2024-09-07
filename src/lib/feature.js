import moment from "moment"

const fileFormat = (url) => {
    const fileExt = url.split('.').pop()

    if (fileExt === "mp4" || fileExt === "webm" || fileExt === "ogg") {
        return "video"
    }
    if (fileExt === "mp3" || fileExt === "wav") {
        return "audio"
    }
    if (fileExt === "png" || fileExt === "jpg" || fileExt === "jpeg" || fileExt === "gif") {
        return "image"
    }
    return "file"

}


const transformImage = (url = "", width = 100) => {
    // console.log(url)
    const newurl = String(url).replace('upload/', `upload/dpr_auto/w_${width}/`)
    return newurl
};

const getLast7Days = () => {
    const curr_date = moment();
    const last7days = []

    for (let i = 0; i < 7; i++) {
        const dayDate = curr_date.clone().subtract(i, days);
        const dayName = dayDate.format("ddd")
    }
    last7days.unshift(dayName)

}

const getOrSaveFromStorage = ({ key, value, get }) => {
    // console.log("value", value)
    if (get) {
        const storedValue = localStorage.getItem(key);
        // console.log(storedValue)
        return storedValue ? JSON.parse(storedValue) : null;
    }
    else {
        localStorage.setItem(key, JSON.stringify(value))
    }
}

export { fileFormat, transformImage, getLast7Days ,getOrSaveFromStorage}