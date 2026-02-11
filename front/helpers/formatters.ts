export const isItImage = (fileType: string | undefined) => {
    if (fileType === 'image/jpeg' || fileType === 'image/png') {
        return true
    }
    return false
}