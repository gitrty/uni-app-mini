
export const wxPromisify = fn => (obj = {}) => new Promise((resolve, reject) => (obj.success = _ => {
    resolve(_)
},
    obj.fail = _ => {
        resolve(null)
    },
    fn(obj))
)