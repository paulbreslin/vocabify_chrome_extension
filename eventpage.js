// Init Sentry
Sentry.init({
	dsn: 'https://96e555de31d14beca54976d68cf6de9a@sentry.io/1419202'
});

// Init Firebase
const firebaseConfig = {
	apiKey: 'AIzaSyBwTk_erRP-kFLroaPA-lQZeaC4ZU6HSXk',
	authDomain: 'vocabify.firebaseapp.com',
	databaseURL: 'https://vocabify.firebaseio.com',
	projectId: 'vocabify'
};

const cloudFunctionURL = 'https://us-central1-vocabify.cloudfunctions.net';

firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({ timestampsInSnapshots: false });

firebase.auth().onAuthStateChanged(async user => {
	if (user && user.uid) {
		initReviewCount(user.uid);
	} else {
		chrome.browserAction.setBadgeText({ text: '' });
	}
});

// Adds number of words to review to Chrome extension icon
initReviewCount = uid => {
	chrome.browserAction.setBadgeBackgroundColor({ color: '#704616' });

	firebase
		.firestore()
		.collection('users')
		.doc(uid)
		.collection('words')
		.onSnapshot(
			({ docs }) => {
				// Runs whenever words collection changes
				const wordsPendingReview = docs
					.map(doc => ({ ...doc.data(), id: doc.id }))
					.filter(({ word }) => word)
					.filter(({ word }) => word !== 'Vocabify')
					.filter(({ reviewDate }) =>
						dateFns.isBefore(reviewDate, dateFns.endOfToday())
					);
				const { length } = wordsPendingReview;
				chrome.storage.local.get(['badgeLastClicked'], result => {
					const { badgeLastClicked } = result;
					if (!dateFns.isToday(badgeLastClicked)) {
						chrome.browserAction.setBadgeText({
							text: length ? `${length}` : ''
						});
					}
				});
			},
			error => {
				Sentry.captureException(error);
			}
		);
};

// Opens Vocabify on install
chrome.runtime.onInstalled.addListener(details => {
	if (details.reason == 'install') {
		openVocabify();
	}
	chrome.storage.local.set({
		hasExtension: true
	});
});

// Opens feedback form on install
chrome.runtime.setUninstallURL(
	'https://docs.google.com/forms/d/e/1FAIpQLSdpbWCab6QBnZa7oepkveWzSbTNgEq0A1x5Uv1cedZlc30w1Q/viewform'
);

// Adds 'Add to Vocabify' to right-click menu
chrome.contextMenus.create({
	title: 'Add to Vocabify',
	id: '1000',
	contexts: ['selection', 'editable']
});

// Registers handlers to open Vocabify site
chrome.notifications.onClicked.addListener(() => openVocabify());
chrome.browserAction.onClicked.addListener(() => {
	chrome.browserAction.setBadgeText({ text: '' });
	// Hides badge count for today when clicked
	chrome.storage.local.set({
		badgeLastClicked: Date.now()
	});
	openVocabify();
});

// Saves word
async function addWord(uid, word) {
	const wordData = {
		word,
		uid
	};

	try {
		await fetch(`${cloudFunctionURL}/addWord`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(wordData)
		});

		chrome.notifications.create({
			type: 'basic',
			title: `'${word}' added to Vocabify`,
			message: 'Click to view the definition',
			iconUrl: 'icon256.png'
		});
	} catch (error) {
		chrome.notifications.create({
			type: 'basic',
			title: `Could not add to Vocabify`,
			message: `An unexpected error occurred`,
			iconUrl: 'icon256.png'
		});
		Sentry.captureException(error);
	}
}

// After logging in to https://vocabifyapp.com, the User ID (UID) is sent to this extension via a restricted Chrome messaging API
chrome.runtime.onMessageExternal.addListener(async ({ uid }) => {
	if (uid) {
		chrome.storage.local.set({ uid });

		try {
			const tokenResponse = await fetch(
				`${cloudFunctionURL}/createCustomToken?uid=${uid}`
			);
			const { token } = await tokenResponse.json();
			await firebase.auth().signInWithCustomToken(token);
		} catch (error) {
			Sentry.captureException(error);
		}
	}
});

// Saves word if user is logged in
// If user not logged in, opens site
chrome.contextMenus.onClicked.addListener(({ selectionText }) => {
	chrome.storage.local.get(['uid'], result => {
		const { uid } = result;
		if (uid) {
			addWord(uid, selectionText);
		} else {
			openVocabify();
		}
	});
});

// Opens Vocabify site
const openVocabify = () =>
	chrome.tabs.create({ url: 'https://vocabifyapp.com/words?signIn=true' });
