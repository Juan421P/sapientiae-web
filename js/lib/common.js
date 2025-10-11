export function buildInitials(text, size = 14) {
	const element = document.createElement('div');
	element.className = `h-${size} w-${size} rounded-full bg-gradient-to-tr from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] flex items-center justify-center drop-shadow text-xs font-bold text-[rgb(var(--button-from))] select-none`;
	element.textContent = text;
	return element;
}

export function formatDate(isoString) {
	const d = new Date(isoString);
	return d.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
}

// export async function showImageModal(src) {
// 	const { Modal } = await import('../../components/overlay/modal/modal.js');
// 	const modal = new Modal({ templateId: 'tmpl-image-preview', size: 'lg', hideCloseButton: true });
// 	modal.contentHost.querySelector('#modal-image-preview').src = src;
// }

export function countEntries(data, filters = []) {
	return data.filter(entry => {
		return filters.every(filter => {
			const entryValue = entry[filter.field];
			const filterValue = filter.value;
			switch (filter.operator) {
				case '>':
					return entryValue > filterValue;
				case '<':
					return entryValue < filterValue;
				case '>=':
					return entryValue >= filterValue;
				case '<=':
					return entryValue <= filterValue;
				case '==':
				case '===':
					return entryValue === filterValue;
				case '!=':
				case '!==':
					return entryValue !== filterValue;
				default:
					return true;
			}
		});
	}).length;
}