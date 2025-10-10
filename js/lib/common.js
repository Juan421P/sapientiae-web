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

export function stripScripts(htmlOrFragment) {
	const tpl = document.createElement('template');
	if (typeof htmlOrFragment === 'string') {
		tpl.innerHTML = htmlOrFragment.trim();
	} else {
		tpl.content.append(htmlOrFragment.cloneNode(true));
	}
	tpl.content.querySelectorAll('script').forEach(s => s.remove());
	return tpl;
}

export function extractTemplateContent(html) {
	const tpl = stripScripts(html);

	const nestedTemplate = tpl.content.querySelector('template');
	if (nestedTemplate) {
		return nestedTemplate.content;
	}

	const form = tpl.content.querySelector('form');
	if (form) {
		const fragment = new DocumentFragment();
		fragment.appendChild(form.cloneNode(true));
		return fragment;
	}

	return tpl.content;
}

export async function showImageModal(src) {
	const { Modal } = await import('../../components/overlay/modal/modal.js');
	const modal = new Modal({ templateId: 'tmpl-image-preview', size: 'lg', hideCloseButton: true });
	modal.contentHost.querySelector('#modal-image-preview').src = src;
}

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