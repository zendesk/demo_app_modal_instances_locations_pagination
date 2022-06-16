let client = ZAFClient.init();


function setSidebarEventHandler(instanceGuid, location) {
    // Get sidebar app instance.
    let appInstance = client.instance(instanceGuid);
    // Have sidebar app call top_bar app's "activeTab" event on sidebar's "app.activated" 
    // and "app.deactivated" events.
    appInstance.on("app.activated", function () {
      client.trigger("activeTab", `{"instanceGuid":"${instanceGuid}", "location": "${location}"}`);
    });
    appInstance.on("app.deactivated", function () {
      client.trigger("activeTab", '{"instanceGuid":"none", "location": "none"}');
    });
  }

  function displaySidebarInfo(instanceGuid, location) {
    let sidebarContainer = document.querySelector("#sidebar_data");
    return sidebarContainer ? sidebarContainer.textContent = `App instance GUID: ${instanceGuid}, location: ${location}` : null;
  }

client.on('app.registered', async function() {

    client.invoke("resize", {width: "800px", height: "600px"});
    
    // Listen for event that sidebar apps will be sending.
    client.on("activeTab", function(data) {
        let instance_info = JSON.parse(data);
        displaySidebarInfo(instance_info.instanceGuid, instance_info.location);
      }); 

        // Find top_bar if it was already created.
    // Attach handler to existing sidebar instances
    const data = await client.get('instances');
        Object.keys(data.instances).forEach(async function(instanceGuid) {
            let location = data.instances[instanceGuid].location;
            if (location === "ticket_sidebar" ||
                location === "user_sidebar") {
              setSidebarEventHandler(instanceGuid, location);
              // When first displaying agent UI, there should only be one app.
              displaySidebarInfo(instanceGuid, location);
            }
            else if (location === "top_bar"){
                let topBar = client.instance(instanceGuid);
                await topBar.invoke("preloadPane");
                return topBar.invoke('popover', 'show');
            }
          });
      
      
       // Wait for top_bar to be created if it hasn't been created yet.
       client.on("instance.created", async function(context) {
        let instanceGuid = context.instanceGuid;
        let location = context.location;
        if (location === "top_bar") {
          let topBar = client.instance(instanceGuid);
          await topBar.invoke("preloadPane");
          // Once top_bar is set up, don't need this handler any longer.
          client.off("instance.created");
          return topBar.invoke('popover', 'show');
        }
        else if (location === "ticket_sidebar" ||
            location === "user_sidebar") {
          setSidebarEventHandler(instanceGuid, location);

          // Sidebar instances of the app are created when first displaying that ticket or user.
          // Update display to new app instance's info.
          displaySidebarInfo(instanceGuid, location);
        }
      });

});