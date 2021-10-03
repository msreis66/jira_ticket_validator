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
            var wrongFields = false, missingFields = [];
            var fields = {
                'versions-val': "Affects Version/s", 
                'fixfor-val': "Fix Version/s", 
                'priority-val': "Priority", 
                'components-val': "Component/s", 
                'customfield_11300-val': "Severity", 
                'customfield_11100-val': "Environment Affected", 
                'customfield_10004-val': "Sprint"
            };

            if (this.isStatusCompleted()) {
                fields['resolution-val'] = "Resolution";
                fields['customfield_10200-val'] = "Issue Resolution";
                fields['customfield_10106-val'] = "Root Cause";
            }

            for (var element in fields) {
                var el = document.getElementById(element)
                if (el !== null && el !== undefined) {
                    var trimmedElValue = el.innerText.trim();
                    var statusCorrect = !['None', 'Unresolved'].includes(trimmedElValue);
                    this.setStatusMark(statusCorrect, el);
                    wrongFields = wrongFields || !statusCorrect;
                    continue;
                }
                missingFields.push(fields[element]);
            }

            this.setStatusReport(missingFields, wrongFields);
        },

        setStatusReport: function (missingFields) {
            var reportElement = document.querySelector('.jira-ticket-validator');

            if (missingFields.length == 0) {
                if (reportElement) {
                    reportElement.parentNode.removeChild(reportElement);
                }
                return;
            }

            if (!reportElement) {
                reportElement = document.createElement('div')
            }

            reportElement.className = 'jira-ticket-validator status-report';
            reportElement.innerHTML = '';
            reportElement.className += ' errors';
            reportElement.innerHTML = `<span><strong>The following fields are missing:</strong> ${missingFields.join(', ')}</span>`;    

            if (!this.validateWorkLog()) {
                reportElement.innerHTML += '<span><strong>There are no work logged in this task</strong></span>';
            }

            var bodyContentElement = document.querySelector('.issue-body-content');
            bodyContentElement.insertBefore(reportElement, bodyContentElement.firstChild);
        },

        validateDescriptionSteps: function () {
            if (!this.isStatusCompleted()) {
                return;
            }
            var descriptionLabel = document.getElementById('descriptionmodule_heading').querySelector('h4');
            var descriptionField = document.getElementById('description-val').innerText.toLowerCase();
            var cond1 = descriptionField.includes('steps to reproduce');
            var cond2 = descriptionField.includes('actual result');
            var cond3 = descriptionField.includes('expected result');
            var validField = cond1 && cond2 && cond3;
            this.setStatusMark(validField, descriptionLabel);
        },

        isStatusCompleted: function () {
            var statusComponent = document.getElementById('status-val').querySelector('span');
            return ['completed', 'in review'].includes(statusComponent.innerText.toLowerCase());
        },

        validateWorkLog: function () {
            if (!this.isStatusCompleted()) {
                console.log('test')
                return true;
            }

            var element = document.getElementById('issue_actions_container');
            var logsEmpty = element.innerText.trim().toLowerCase().includes('no work has yet been logged on this issue.');

            return !logsEmpty;
        },
    }
    funcs.validateFieldById();
    funcs.validateFieldLabels();
    funcs.validateDescriptionSteps();
}

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: ticketValidator
    })
});