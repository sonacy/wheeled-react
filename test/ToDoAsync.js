const TODOAPP = 'react-todos'

export function getList() {
  return new Promise((resolve, reject) => {
    try {
      const list = localStorage.getItem(TODOAPP) || JSON.stringify([])
      resolve({
        code: 0,
        data: JSON.parse(list)
      })
    } catch(e) {
      reject({
        code: -1,
        error: e
      })
    }
  })
}

export function updateItem(list) {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(TODOAPP, JSON.stringify(list))
      resolve({
        code: 0
      })
    } catch(e) {
      reject({
        code: -1,
        error: e
      })
    }
  })
}
