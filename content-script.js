var requiredLabels = ['issuetype', 'phase', 'bugtype'];
var labelsWrapper = document.getElementById('wrap-labels');
var labelsElement = labelsWrapper.querySelectorAll('ul.labels li a');
var labels = [];
labelsElement.forEach(e => labels.push(e.title))
var missingLabels = requiredLabels.filter(e => !labels.some(a => a.toLowerCase().includes(e)))
console.log('Missing labels: ', missingLabels)
var className = missingLabels.length ? 'errormark' : 'checkmark'

var fieldStatusMark = labelsWrapper.getElementsByClassName('field-status-mark')[0]
if (fieldStatusMark == undefined) {
    fieldStatusMark = document.createElement('span')
    fieldStatusMark.className = 'field-status-mark'
    fieldStatusMark.innerHTML = '<div class="status-mark-circle"></div><div class="status-mark-stem"></div><div class="status-mark-kick"></div>'
    labelsWrapper.appendChild(fieldStatusMark)
}

fieldStatusMark.classList.remove('errormark')
fieldStatusMark.classList.remove('checkmark')
fieldStatusMark.classList.add(className)