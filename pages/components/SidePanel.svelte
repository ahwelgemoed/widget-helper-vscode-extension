<script lang="ts">
  import { ifError } from "assert";

  import { onMount } from "svelte";

  let envPath = "";
  let isWorkspace = false;
  let widgetPath = "";
  let widgetNameToAdd = "";
  let files: any;
  let mendixFiles: any;
  let mendixFile: any;

  console.log("isWorkspace", isWorkspace);

  $: if (mendixFiles) {
    console.log("(mendixFiles.path as string).replace");
    const parsePath = (mendixFiles.path as string).replace(
      `/${mendixFiles.name}`,
      ""
    );
    mendixFile = parsePath;
    envPath = parsePath;
  }
  $: if (files) {
    widgetPath = (files[0].path as string).replace(`/${files[0].name}`, "");
    const splitPath = widgetPath.split("/");
    widgetNameToAdd = splitPath[splitPath.length - 1];
  }

  // $: $mendixFiles = mendixFiles;

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data;
      switch (message.command) {
        case "mx-path": {
          envPath = message.value;
          mendixFile = message.value;
          return;
        }
        case "is-workspace": {
          console.log("message.value", message.value);
          isWorkspace = message.value;
          return;
        }
      }
    });
    tsVscode.postMessage({ command: "get-env", value: undefined });
  });
</script>

<div>
  <h1>MX Widget Helper</h1>
  <h2>Open Widget First</h2>
  <h3>1) Select Mendix</h3>

  <label for="mx-file-upload" class="custom-file-upload">
    Select Mendix Project
  </label>
  <input
    id="mx-file-upload"
    type="file"
    webkitdirectory
    directory
    multiple
    on:input={(e) => (mendixFiles = e.target.files[0])}
  />
  {#if mendixFile}
    <h4>
      PATH TO MENDIX: {mendixFile}
    </h4>
  {/if}

  <div class="btn-container">
    <button
      disabled={!envPath}
      on:click={() => {
        tsVscode.postMessage({ command: "create-env", value: envPath });
      }}>Create ENVs</button
    >
  </div>
  <hr />
  <h3>2) After Creating an .ENV craet a workspace with your Mendix Project</h3>
  <div class="btn-container">
    <button
      disabled={!envPath || isWorkspace}
      on:click={() => {
        tsVscode.postMessage({
          command: "create-workspace",
          value: "undefined",
        });
      }}>Create Workspace</button
    >
  </div>
  <hr />
  <h3>3) Add Widget To Workspace (Optional)</h3>
  <label for="file-upload" class="custom-file-upload"> Select Widget </label>

  <input
    id="file-upload"
    type="file"
    webkitdirectory
    directory
    multiple
    bind:files
  />
  {#if widgetNameToAdd}
    <h4>
      Widget to link ({widgetNameToAdd})
    </h4>
  {/if}
  <div class="btn-container">
    <button
      disabled={!widgetNameToAdd}
      on:click={() => {
        tsVscode.postMessage({
          command: "add-widget-to-workspace",
          value: { widgetPath, envPath },
        });
      }}>Add Widget</button
    >
  </div>

  <h4>Some Helpers</h4>
  <div class="btn-container">
    {#if isWorkspace === true}
      <button
        on:click={() => {
          tsVscode.postMessage({
            command: "open-mx",
            value: undefined,
          });
        }}>Open Mendix Project</button
      >
    {/if}
    <a href="https://sprintr.home.mendix.com/">Open Sprintr</a>
  </div>
</div>
