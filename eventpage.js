// Opens Vocabify on install
chrome.runtime.onInstalled.addListener(details => {
	if (details.reason == 'install') {
		openVocabify();
	}
});

// Adds 'Add to Vocabify' to right-click menu
chrome.contextMenus.create({
	title: 'Add to Vocabify',
	id: '1000',
	contexts: ['selection', 'editable']
});

// Registers handlers to open Vocabify site
chrome.notifications.onClicked.addListener(() => openVocabify());
chrome.browserAction.onClicked.addListener(() => openVocabify());

// Saves word
async function addWord(uid, word) {
	const wordData = {
		word,
		uid
	};

	try {
		await fetch('https://us-central1-vocabify.cloudfunctions.net/addWord', {
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
	}
}

// After logging in to https://vocabifyapp.com, the User ID (UID) is sent to this extension via a restricted Chrome messaging API
chrome.runtime.onMessageExternal.addListener(({ uid }) => {
	if (uid) {
		chrome.storage.local.set({ uid });
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
