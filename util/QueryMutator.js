function stringify(queryObj) {
  const r = ['?']
  Object.keys(queryObj).forEach(key => {
    r.push(key)
    r.push("=")
    r.push(queryObj[key])
    r.push("&")
  })
  return r.join('').slice(0, -1)
}

function objectify(queryStr) {
  const str = queryStr.substr(1, queryStr.length)
  const values = str.split("&")
  let r = {}
  values.forEach(v => {
    const tmp = v.split("=")
    r[tmp[0]] = tmp[1]
  })
  return r
}

export {
  stringify,
  objectify
}

const testStr = '?status=Open&effort_gte=4&effort_lte=12'
const testObj = {
  status: "Open",
  effort_lte: 12,
  effort_gte: 4,
}