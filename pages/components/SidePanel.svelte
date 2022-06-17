<script lang="ts">
  import { onMount } from "svelte";

  let envPath = "";
  let isWorkspace = false;
  let widgetPath = "";
  let widgetNameToAdd = "";
  let files: any;

  $: if (files) {
    widgetPath = (files[0].path as string).replace(`/${files[0].name}`, "");
    const splitPath = widgetPath.split("/");
    widgetNameToAdd = splitPath[splitPath.length - 1];
  }

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data;
      switch (message.command) {
        case "mx-path": {
          envPath = message.value;
          return;
        }
        case "is-workspace": {
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
  <h3>1) Add Path to Mendix Project</h3>
  <input bind:value={envPath} placeholder="Path to MX Project" />
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
      disabled={!envPath}
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

  {#if isWorkspace === true}
    <h4>Some Helpers</h4>
    <div class="btn-container">
      <button
        on:click={() => {
          tsVscode.postMessage({
            command: "open-mx",
            value: undefined,
          });
        }}>Open Mendix Project</button
      >
      <a href="https://sprintr.home.mendix.com/">Open Sprintr</a>
    </div>
  {/if}
</div>
