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