function ticketValidator() {

    var funcs = {
        validateFieldLabels: function () {
            var requiredLabels = ['issuetype', 'phase', 'bugtype'];
            var labelsWrapper = document.getElementById('wrap-labels');
            var labelsElement = labelsWrapper.querySelectorAll('ul.labels li a');
            var labels = [];
            labelsElement.forEach(e => labels.push(e.title))
            var missingLabels = requiredLabels.filter(e => !labels.some(a => a.toLowerCase().includes(e)))
            var labelsValueWrapper = labelsWrapper.getElementsByClassName('labels-wrap')
            this.setStatusMark(missingLabels.length === 0, labelsValueWrapper[0]);
        },

        setStatusMark: function (isCorrect, element) {
            var className = isCorrect ? 'checkmark' : 'errormark';

            var fieldStatusMark = element.getElementsByClassName('field-status-mark')[0];
            if (fieldStatusMark == undefined) {
                fieldStatusMark = document.createElement('span');
                fieldStatusMark.className = 'field-status-mark';
                fieldStatusMark.innerHTML = '<div class="status-mark-circle"></div><div class="status-mark-stem"></div><div class="status-mark-kick"></div>';
                element.appendChild(fieldStatusMark);
            }

            fieldStatusMark.classList.remove('errormark');
            fieldStatusMark.classList.remove('checkmark');
            fieldStatusMark.classList.add(className);
        },

        validateFieldById: function () {
            var fields = ['versions-val', 'fixfor-val', 'priority-val', 'components-val', 'customfield_11300-val', 'customfield_11100-val', 'customfield_10004-val'];

            if (this.isStatusCompleted()) {
                fields.push('resolution-val', 'customfield_10200-val', 'customfield_10106-val');
            }

            fields.forEach(element => {
                var el = document.getElementById(element)
                if (el !== null && el !== undefined) {
                    var trimmedElValue = el.innerText.trim();
                    var statusCorrect = !['None', 'Unresolved'].includes(trimmedElValue);
                    this.setStatusMark(statusCorrect, el)
                }
            });
        },

        isStatusCompleted: function () {
            var statusComponent = document.getElementById('status-val').querySelector('span');
            return statusComponent.innerHTML === 'Completed';
        },
    }
    funcs.validateFieldById();
    funcs.validateFieldLabels();
}

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: ticketValidator
    })
});