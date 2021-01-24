const response = (res, status, data) => {
    res.status(status).json({ data })
}   

const createResponse = (data) => {
    return [{ msg: data }]
}

export { response, createResponse }