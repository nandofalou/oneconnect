const storage = {
  load: (name) => {
    const rawValue = localStorage.getItem(name)
    if (storage.isJson(rawValue)) {
      return JSON.parse(rawValue)
    } else {
      return { rawValue }
    }
  },
  save: (name, obj) => {
    localStorage.setItem(name, JSON.stringify(obj))
  },
  delete: (name) => {
    localStorage.removeItem(name)
  },
  isJson: function (str) {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }
    return true
  }
}

export default storage
