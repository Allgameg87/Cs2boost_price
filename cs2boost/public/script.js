// Initialize sparkles for all buttons
const buttons = document.querySelectorAll('.cta-button, .nav-cta');
buttons.forEach(button => {
    const sparklesContainer = button.querySelector('.sparkles');
    const sparkleCount = 8;

    // Create sparkles with evenly distributed positions
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        sparklesContainer.appendChild(sparkle);

        // Initial circular distribution
        const angle = (i / sparkleCount) * 2 * Math.PI;
        const radius = 30 + Math.random() * 20; // Random radius between 30% and 50%
        const x = 50 + radius * Math.cos(angle); // Center at 50% + offset
        const y = 50 + radius * Math.sin(angle); // Center at 50% + offset
        sparkle.style.left = `${x}%`;
        sparkle.style.top = `${y}%`;
        sparkle.style.animationDelay = `${Math.random() * 2}s`;

        // Update position on animation iteration
        sparkle.addEventListener('animationiteration', () => {
            const newAngle = Math.random() * 2 * Math.PI;
            const newRadius = 30 + Math.random() * 20;
            const newX = 50 + newRadius * Math.cos(newAngle);
            const newY = 50 + newRadius * Math.sin(newAngle);
            sparkle.style.left = `${newX}%`;
            sparkle.style.top = `${newY}%`;
            sparkle.style.animationDelay = `${Math.random() * 2}s`;
        });
    }
});

// Handle payment initiation
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        const product = button.getAttribute('data-product');
        const amount = button.getAttribute('data-amount');
        const email = prompt('Введите ваш email для получения ключа:');
        if (!email) return;

        try {
            const response = await fetch('/api/initiate-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, email, product })
            });
            const data = await response.json();
            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                alert('Ошибка при инициации платежа');
            }
        } catch (error) {
            alert('Ошибка: ' + error.message);
        }
    });
});

// Interactive background gradient
const pricing = document.querySelector('.pricing');
document.addEventListener('mousemove', (e) => {
    const rect = pricing.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top)