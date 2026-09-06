// Utility helper for Google Analytics 4 (GA4) event tracking.

export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

/**
 * Safely trigger custom GA4 events.
 * @param {string} eventName - Name of the custom event (e.g. 'whatsapp_click')
 * @param {Record<string, any>} params - Optional event parameters
 */
export const trackEvent = (eventName, params = {}) => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
    }
};

/**
 * Custom event helper for WhatsApp CTA clicks.
 * @param {string} location - Identifies where the click happened (e.g., 'hero', 'navbar', 'product_detail')
 */
export const trackWhatsAppClick = (location = 'general') => {
    trackEvent('whatsapp_click', {
        event_category: 'engagement',
        event_label: location,
    });
};
