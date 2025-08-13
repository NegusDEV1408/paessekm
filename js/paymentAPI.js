// APIs de Paiement Mobile - Wave et Orange Money
// Intégration avec QR Code pour les dons

class PaymentAPI {
    constructor() {
        this.waveConfig = {
            apiKey: 'YOUR_WAVE_API_KEY',
            merchantId: 'YOUR_WAVE_MERCHANT_ID',
            baseUrl: 'https://api.wave.com/v1',
            qrEndpoint: '/payments/qr-code'
        };
        
        this.orangeMoneyConfig = {
            apiKey: 'YOUR_ORANGE_MONEY_API_KEY',
            merchantId: 'YOUR_ORANGE_MERCHANT_ID',
            baseUrl: 'https://api.orange.com/money/v1',
            qrEndpoint: '/payments/qr'
        };
        
        this.currentPaymentMethod = 'wave';
        this.init();
    }

    init() {
        this.setupPaymentMethodListeners();
        this.setupQRCodeGeneration();
    }

    setupPaymentMethodListeners() {
        const paymentOptions = document.querySelectorAll('input[name="payment-method"]');
        paymentOptions.forEach(option => {
            option.addEventListener('change', (e) => {
                this.currentPaymentMethod = e.target.value;
                this.updatePaymentInterface();
            });
        });
    }

    setupQRCodeGeneration() {
        const donateButton = document.querySelector('.btn-donate');
        if (donateButton) {
            donateButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.processDonation();
            });
        }
    }

    async processDonation() {
        const form = document.querySelector('.donation-form');
        if (!form) return;

        const formData = new FormData(form);
        const amount = this.getSelectedAmount();
        const donorName = formData.get('donor-name') || document.getElementById('donor-name')?.value;
        const donorEmail = formData.get('donor-email') || document.getElementById('donor-email')?.value;
        const donorPhone = formData.get('donor-phone') || document.getElementById('donor-phone')?.value;
        const message = formData.get('donation-message') || document.getElementById('donation-message')?.value;

        if (!amount || amount <= 0) {
            this.showError('Veuillez sélectionner un montant valide');
            return;
        }

        if (!donorName || !donorEmail) {
            this.showError('Veuillez remplir tous les champs obligatoires');
            return;
        }

        try {
            this.showLoading();
            const qrCodeData = await this.generateQRCode(amount, donorName, donorEmail, donorPhone, message);
            this.showQRCodeModal(qrCodeData);
        } catch (error) {
            console.error('Erreur lors de la génération du QR code:', error);
            this.showError('Erreur lors de la génération du QR code. Veuillez réessayer.');
        } finally {
            this.hideLoading();
        }
    }

    getSelectedAmount() {
        const activeButton = document.querySelector('.amount-btn.active');
        if (activeButton) {
            const buttonAmount = activeButton.getAttribute('data-amount');
            if (buttonAmount === 'custom') {
                return parseFloat(document.getElementById('custom-amount')?.value || 0);
            }
            return parseFloat(buttonAmount || 0);
        }
        return 0;
    }

    async generateQRCode(amount, donorName, donorEmail, donorPhone, message) {
        const paymentData = {
            amount: amount,
            currency: 'XOF',
            merchantId: this.currentPaymentMethod === 'wave' ? this.waveConfig.merchantId : this.orangeMoneyConfig.merchantId,
            reference: this.generateReference(),
            description: `Don de ${donorName} - ${message || 'Soutien à la fondation'}`,
            customer: {
                name: donorName,
                email: donorEmail,
                phone: donorPhone
            },
            callbackUrl: `${window.location.origin}/payment-callback.html`,
            returnUrl: `${window.location.origin}/pages/fondation.html?payment=success`
        };

        if (this.currentPaymentMethod === 'wave') {
            return await this.generateWaveQRCode(paymentData);
        } else {
            return await this.generateOrangeMoneyQRCode(paymentData);
        }
    }

    async generateWaveQRCode(paymentData) {
        try {
            const response = await fetch(`${this.waveConfig.baseUrl}${this.waveConfig.qrEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.waveConfig.apiKey}`,
                    'X-Merchant-ID': this.waveConfig.merchantId
                },
                body: JSON.stringify(paymentData)
            });

            if (!response.ok) {
                throw new Error(`Wave API error: ${response.status}`);
            }

            const data = await response.json();
            return {
                qrCodeUrl: data.qrCodeUrl,
                qrCodeImage: data.qrCodeImage,
                transactionId: data.transactionId,
                paymentUrl: data.paymentUrl,
                provider: 'Wave'
            };
        } catch (error) {
            // Fallback pour la démo - génération d'un QR code simulé
            return this.generateDemoQRCode(paymentData, 'Wave');
        }
    }

    async generateOrangeMoneyQRCode(paymentData) {
        try {
            const response = await fetch(`${this.orangeMoneyConfig.baseUrl}${this.orangeMoneyConfig.qrEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.orangeMoneyConfig.apiKey}`,
                    'X-Merchant-ID': this.orangeMoneyConfig.merchantId
                },
                body: JSON.stringify(paymentData)
            });

            if (!response.ok) {
                throw new Error(`Orange Money API error: ${response.status}`);
            }

            const data = await response.json();
            return {
                qrCodeUrl: data.qrCodeUrl,
                qrCodeImage: data.qrCodeImage,
                transactionId: data.transactionId,
                paymentUrl: data.paymentUrl,
                provider: 'Orange Money'
            };
        } catch (error) {
            // Fallback pour la démo - génération d'un QR code simulé
            return this.generateDemoQRCode(paymentData, 'Orange Money');
        }
    }

    generateDemoQRCode(paymentData, provider) {
        // Simulation d'un QR code pour la démo
        const qrData = {
            provider: provider,
            amount: paymentData.amount,
            reference: paymentData.reference,
            merchant: 'Fondation Keur Massar',
            timestamp: new Date().toISOString()
        };

        const qrCodeString = JSON.stringify(qrData);
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCodeString)}`;

        return {
            qrCodeUrl: qrCodeUrl,
            qrCodeImage: qrCodeUrl,
            transactionId: paymentData.reference,
            paymentUrl: qrCodeUrl,
            provider: provider,
            isDemo: true
        };
    }

    generateReference() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        return `DON-${timestamp}-${random}`.toUpperCase();
    }

    showQRCodeModal(qrData) {
        const modal = document.createElement('div');
        modal.className = 'qr-payment-modal';
        modal.innerHTML = `
            <div class="qr-modal-backdrop"></div>
            <div class="qr-modal-content">
                <div class="qr-modal-header">
                    <h3><i class="fas fa-qrcode"></i> Paiement par ${qrData.provider}</h3>
                    <button class="qr-modal-close" onclick="this.closest('.qr-payment-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="qr-modal-body">
                    <div class="qr-code-container">
                        <img src="${qrData.qrCodeImage}" alt="QR Code ${qrData.provider}" class="qr-code-image">
                        <div class="qr-instructions">
                            <h4>Instructions de paiement :</h4>
                            <ol>
                                <li>Ouvrez l'application ${qrData.provider} sur votre téléphone</li>
                                <li>Scannez le QR code ci-dessus</li>
                                <li>Confirmez le montant de ${qrData.amount.toLocaleString('fr-FR')} FCFA</li>
                                <li>Validez votre paiement</li>
                            </ol>
                        </div>
                    </div>
                    <div class="payment-details">
                        <div class="detail-item">
                            <span class="label">Montant :</span>
                            <span class="value">${qrData.amount.toLocaleString('fr-FR')} FCFA</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Référence :</span>
                            <span class="value">${qrData.transactionId}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Fournisseur :</span>
                            <span class="value">${qrData.provider}</span>
                        </div>
                    </div>
                    <div class="qr-actions">
                        <button class="qr-action-btn primary" onclick="paymentAPI.openPaymentApp('${qrData.provider}')">
                            <i class="fas fa-external-link-alt"></i>
                            Ouvrir ${qrData.provider}
                        </button>
                        <button class="qr-action-btn secondary" onclick="paymentAPI.copyPaymentUrl('${qrData.paymentUrl}')">
                            <i class="fas fa-copy"></i>
                            Copier le lien
                        </button>
                    </div>
                </div>
                <div class="qr-modal-footer">
                    <p class="payment-status">
                        <i class="fas fa-clock"></i>
                        En attente de paiement...
                    </p>
                    <div class="payment-timer" id="payment-timer">05:00</div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.startPaymentTimer();
        this.checkPaymentStatus(qrData.transactionId);
    }

    startPaymentTimer() {
        let timeLeft = 300; // 5 minutes
        const timerElement = document.getElementById('payment-timer');
        
        const timer = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                this.showPaymentTimeout();
            }
            timeLeft--;
        }, 1000);
    }

    async checkPaymentStatus(transactionId) {
        // Simulation de vérification du statut de paiement
        setTimeout(() => {
            // Dans un vrai environnement, vous feriez un appel API ici
            console.log(`Vérification du statut pour la transaction: ${transactionId}`);
        }, 5000);
    }

    openPaymentApp(provider) {
        let appUrl = '';
        if (provider === 'Wave') {
            appUrl = 'wave://';
        } else if (provider === 'Orange Money') {
            appUrl = 'orangemoney://';
        }
        
        if (appUrl) {
            window.open(appUrl, '_blank');
        }
    }

    copyPaymentUrl(url) {
        navigator.clipboard.writeText(url).then(() => {
            this.showSuccess('Lien de paiement copié !');
        }).catch(() => {
            this.showError('Impossible de copier le lien');
        });
    }

    showPaymentTimeout() {
        const statusElement = document.querySelector('.payment-status');
        if (statusElement) {
            statusElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Temps expiré';
            statusElement.style.color = '#e74c3c';
        }
    }

    showLoading() {
        const button = document.querySelector('.btn-donate');
        if (button) {
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Génération du QR code...';
            button.disabled = true;
        }
    }

    hideLoading() {
        const button = document.querySelector('.btn-donate');
        if (button) {
            button.innerHTML = '<i class="fas fa-heart"></i> Faire un don';
            button.disabled = false;
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `payment-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    updatePaymentInterface() {
        // Mettre à jour l'interface selon la méthode de paiement sélectionnée
        console.log(`Méthode de paiement sélectionnée: ${this.currentPaymentMethod}`);
    }
}

// Initialisation de l'API de paiement
const paymentAPI = new PaymentAPI();

// Export pour utilisation globale
window.paymentAPI = paymentAPI; 