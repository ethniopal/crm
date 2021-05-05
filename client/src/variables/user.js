import generator from 'generate-password'

//Liste des permission
export const userPermission = {
	ADMIN: 'Administrateur',
	COLLABORATOR: 'Collaborateur',
	SELLER: 'Vendeur',
	DISPATCHER: 'Dispath',
	GUESS: 'Invité'
}

export const userStatus = {
	ACTIVE: 'Actif',
	INACTIVE: 'Inactif'
}

export function haveAccess(permissionList) {
	let haveAccess = true
	const userPermission = localStorage.getItem('permission')

	if (Array.isArray(permissionList) && !permissionList.includes(userPermission)) {
		haveAccess = false
	}
	return haveAccess
}

export const generatePassword = () =>
	generator.generate({
		length: 12,
		numbers: true,
		excludeSimilarCharacters: true,
		exclude: '\'"\\'
	})

// export default userPermission
