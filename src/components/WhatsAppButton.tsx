// TODO: заменить на реальный номер при деплое
const WHATSAPP_NUMBER = '79999999999';

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Написать в WhatsApp"
      className="group fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg transition"
    >
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-gray-900 text-white text-sm px-3 py-1.5 opacity-0 translate-x-2 transition group-hover:opacity-100 group-hover:translate-x-0">
        Написать в WhatsApp
      </span>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.527 5.847L0 24l6.305-1.654A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.795 0-3.477-.464-4.94-1.276l-.353-.207-3.741.981.998-3.648-.232-.374A9.94 9.94 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z" />
      </svg>
    </a>
  );
}
