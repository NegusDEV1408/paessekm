# 🏦 Configuration des APIs de Paiement Mobile

## 📱 Intégration Wave et Orange Money

Ce document explique comment configurer les APIs de paiement mobile pour permettre aux donateurs de faire des dons via QR code.

## 🔧 Configuration requise

### 1. **Wave Money API**

#### Inscription développeur
1. Visitez [Wave Developer Portal](https://developer.wave.com/)
2. Créez un compte développeur
3. Créez une nouvelle application
4. Obtenez vos clés API :
   - `API_KEY`
   - `MERCHANT_ID`
   - `SECRET_KEY`

#### Configuration dans le code
```javascript
// Dans js/paymentAPI.js
this.waveConfig = {
    apiKey: 'VOTRE_WAVE_API_KEY',
    merchantId: 'VOTRE_WAVE_MERCHANT_ID',
    baseUrl: 'https://api.wave.com/v1',
    qrEndpoint: '/payments/qr-code'
};
```

### 2. **Orange Money API**

#### Inscription développeur
1. Visitez [Orange Developer Portal](https://developer.orange.com/)
2. Créez un compte développeur
3. Activez l'API Orange Money
4. Obtenez vos clés API :
   - `API_KEY`
   - `MERCHANT_ID`
   - `CLIENT_SECRET`

#### Configuration dans le code
```javascript
// Dans js/paymentAPI.js
this.orangeMoneyConfig = {
    apiKey: 'VOTRE_ORANGE_MONEY_API_KEY',
    merchantId: 'VOTRE_ORANGE_MERCHANT_ID',
    baseUrl: 'https://api.orange.com/money/v1',
    qrEndpoint: '/payments/qr'
};
```

## 🚀 Fonctionnalités implémentées

### ✅ QR Code de paiement
- Génération automatique de QR codes
- Intégration avec les applications mobiles
- Instructions de paiement claires

### ✅ Interface utilisateur
- Modal moderne et responsive
- Sélection de méthode de paiement
- Timer de paiement (5 minutes)
- Notifications en temps réel

### ✅ Sécurité
- Validation des montants
- Génération de références uniques
- Gestion des erreurs
- Fallback en mode démo

## 📋 Étapes de configuration

### 1. **Remplacer les clés API**
```javascript
// Remplacez dans js/paymentAPI.js
apiKey: 'YOUR_WAVE_API_KEY' → 'VOTRE_VRAIE_CLE_API'
merchantId: 'YOUR_WAVE_MERCHANT_ID' → 'VOTRE_VRAI_MERCHANT_ID'
```

### 2. **Configurer les URLs de callback**
```javascript
callbackUrl: `${window.location.origin}/payment-callback.html`,
returnUrl: `${window.location.origin}/pages/fondation.html?payment=success`
```

### 3. **Créer la page de callback**
Créez `payment-callback.html` pour gérer les retours de paiement.

### 4. **Tester en mode démo**
Le système fonctionne en mode démo par défaut pour les tests.

## 🔒 Sécurité et bonnes pratiques

### ✅ Recommandations
- Utilisez HTTPS en production
- Validez tous les montants côté serveur
- Implémentez la vérification de signature
- Gérez les timeouts de paiement
- Loggez toutes les transactions

### ⚠️ Points d'attention
- Ne stockez jamais les clés API dans le code client
- Utilisez des variables d'environnement
- Implémentez une validation côté serveur
- Gérez les cas d'erreur réseau

## 📱 Utilisation par les donateurs

### 1. **Sélection du montant**
- Choisir parmi les montants prédéfinis
- Ou saisir un montant personnalisé

### 2. **Choix du mode de paiement**
- Wave (par défaut)
- Orange Money

### 3. **Paiement par QR code**
- Scanner le QR code avec l'app mobile
- Confirmer le montant
- Valider le paiement

### 4. **Confirmation**
- Notification de succès
- Email de confirmation
- Référence de transaction

## 🛠️ Développement et tests

### Mode démo
Le système inclut un mode démo qui génère des QR codes simulés pour les tests.

### Logs de débogage
```javascript
// Activez les logs pour le débogage
console.log('Transaction ID:', transactionId);
console.log('QR Code URL:', qrCodeUrl);
```

### Tests locaux
1. Ouvrez la page fondation.html
2. Remplissez le formulaire de don
3. Cliquez sur "Faire un don"
4. Vérifiez l'affichage du QR code

## 📞 Support technique

### Wave Money
- Documentation : https://developer.wave.com/
- Support : support@wave.com
- Téléphone : +221 33 XXX XXXX

### Orange Money
- Documentation : https://developer.orange.com/
- Support : support@orange.com
- Téléphone : +221 33 XXX XXXX

## 🔄 Mise à jour et maintenance

### Mise à jour des APIs
- Surveillez les changements d'API
- Testez les nouvelles versions
- Mettez à jour la documentation

### Monitoring
- Surveillez les taux de succès
- Gérez les erreurs de paiement
- Optimisez l'expérience utilisateur

---

**Note** : Ce système est conçu pour fonctionner au Sénégal avec les APIs locales de paiement mobile. Assurez-vous de respecter les réglementations locales en matière de paiement électronique. 