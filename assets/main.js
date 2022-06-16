let client = ZAFClient.init();
let modalClient = null;
let parentClient = null;


// Create the modal
function displayModal() {
  return client.invoke('instances.create', {
    location: 'modal',
    url: 'assets/modal.html',
    size: {
      width: '40vw',
      height: '40vh',
    }
  });
}

// Add the tags to the ticket in the UI  
function addTagsToTicket(tagArray) {
  client.invoke('ticket.tags.add', tagArray);
}

// Send the selected tags from the modal to the ticket sidebar
async function sendDataToParentAndClose() {
  console.debug("sendDataToParentAndClose called...");
  let tagsToAdd = [];

  const context = await client.context();
  let instanceGuid = context.instanceGuid;
  modalClient = client.instance(instanceGuid);
  document.querySelector('#tag1').checked ? tagsToAdd.push('tag1') : null;
  document.querySelector('#tag2').checked ? tagsToAdd.push('tag2') : null;
  document.querySelector('#tag3').checked ? tagsToAdd.push('tag3') : null;
  parentClient.trigger('send_modal_data', JSON.stringify(tagsToAdd));
  modalClient.invoke('destroy');
}

// Close the modal without sending changes to the ticket sidebar
async function cancelChange() {
  const context = await client.context();
  let instanceGuid = context.instanceGuid;
  modalClient = client.instance(instanceGuid);

  console.debug("cancelChange called...");
  modalClient.invoke('destroy');

}


// Framework events 

client.on('app.registered', function () {

  // Listen for the modal registration
  client.on('instance.registered', function (context) {
    if (context.location === 'modal') {
      let instanceGuid = context.instanceGuid;
      modalClient = client.instance(instanceGuid);

      // Trigger the event to send the parent instance GUID to the modal
      modalClient.trigger(
        'send_parent_client_guid_event',
        client._instanceGuid
      );
    }
  });


  // Send the modal data to the ticket sidebar to both display and add to the ticket
  client.on('send_modal_data', function (modalData) {
    console.debug('send_modal_data event called...');
    console.debug(modalData);

    let tagArray = JSON.parse(modalData);
    console.debug('tagArray:', tagArray);
    document.querySelector('#modalData').insertAdjacentHTML('afterbegin', `Added tags: ${modalData}`);
    addTagsToTicket(tagArray);
  });

  // Receive the parent client instance 
  client.on('send_parent_client_guid_event', function (parentClientGuid) {
    console.debug('Receiving parent guid...', parentClientGuid);
    parentClient = client.instance(parentClientGuid);
  });
});




// Ticket sidebar and modal button click listeners
window.addEventListener('DOMContentLoaded', function (event) {

  let displayModalButton = document.querySelector("#displayModal");
  let addTagsButton = document.querySelector("#addTagsToTicketAndClose");
  let cancelButton = document.querySelector("#cancel");

  if (displayModalButton) {
    displayModalButton.addEventListener("click", function () {
      console.log("Display Modal Button clicked.");
      displayModal();
    });
  }

  if (addTagsButton) {
    addTagsButton.addEventListener("click", function () {
      console.log("Add Tags Button clicked.");
      sendDataToParentAndClose();
    });
  }

  if (cancelButton) {
    cancelButton.addEventListener("click", function () {
      console.log("Cancel Button clicked.");
      cancelChange();
    });
  }

});

// API that returns paginated results. 
// Modify depending on desired resource or result set.  This example uses account audit logs.
// https://developer.zendesk.com/api-reference/ticketing/account-configuration/audit_logs/
let paged_request = '/api/v2/audit_logs.json'
// Where paginated results are stored.
let finalArray = [];

async function fetchData(page) {

  try {
    // If there's no next page, log the results to the console.
    if (page === null) {
      console.log("Final array:", finalArray);
      client.invoke(
        "notify",
        "Data fetch complete. Check the console for the results.",
        "notice"
      );
      return;
    }

    let response = await client.request(page);
    // Iterate through the results
    response.audit_logs.forEach(function (element) {
      // And each audit ID to the array
      finalArray.push(element.id);
    });

    // Send request for the next page
    console.log("next_page:", response.next_page);
    fetchData(response.next_page);
  } catch (error) {
    client.invoke(
      "notify",
      "Error sending request.",
      "error"
    );
    console.log(error);
  }
}

function buttonPress() {
  fetchData(paged_request);
}
