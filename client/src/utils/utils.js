export function hasChildren(item) {
	const { items: children } = item

	if (children === undefined) {
		return false
	}

	if (children.constructor !== Array) {
		return false
	}

	if (children.length === 0) {
		return false
	}

	return true
}

export function haveAccess(permissionList) {
	let haveAccess = true
	const userPermission = localStorage.getItem('permission')

	if (Array.isArray(permissionList) && !permissionList.includes(userPermission)) {
		haveAccess = false
	}
	return haveAccess
}

export function formatDate(createdAt) {
	const d = new Date(createdAt)
	const year = d.getFullYear()
	const month = (d.getMonth() + 1 + '').padStart(2, '0')
	const day = (d.getDate() + '').padStart(2, '0')
	const hour = d.getHours()
	const minutes = (d.getMinutes() + '').padStart(2, '0')

	return `${year}/${month}/${day} ${hour}:${minutes}`
}

export function nl2br(str, is_xhtml) {
	if (typeof str === 'undefined' || str === null) {
		return ''
	}
	var breakTag = is_xhtml || typeof is_xhtml === 'undefined' ? '<br />' : '<br>'
	return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2')
}

export function flattenObject(ob) {
	var toReturn = {}

	for (var i in ob) {
		if (!ob.hasOwnProperty(i)) continue

		if (typeof ob[i] == 'object' && ob[i] !== null) {
			var flatObject = flattenObject(ob[i])
			for (var x in flatObject) {
				if (!flatObject.hasOwnProperty(x)) continue

				toReturn[i + '.' + x] = flatObject[x]
			}
		} else {
			toReturn[i] = ob[i]
		}
	}
	return toReturn
}
