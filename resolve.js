document.addEventListener("DOMContentLoaded", () => {
  function resolvedResult(hostname, record, startTime) {
    const resultsList = document.getElementById("resolved-list");
    const liResult = document.createElement("li");
    const canonicalName = record.canonicalName;

    const endTime = performance.now();
    const duration = endTime - startTime;

    liResult.textContent = `Resolved Hostname: "${hostname}" in duration ${duration.toFixed(
      2
    )} ms `;

    if (liResult.canonicalName !== undefined) {
      liResult.textContent += ` Canonical Name: ${canonicalName}`;
    }

    liResult.textContent += ` Resolved Addresses: ${record.addresses.join(
      ", "
    )}`;
    resultsList.appendChild(liResult);
  }

  const searchButton = document.getElementById("search-button");
  const searchField = document.getElementById("search-input");

  function resolveHostFromSubmission() {
    const hostname = searchField.value;
    if (!hostname.length) {
      return;
    }

    const resolving = browser.dns.resolve(hostname, ["bypass_cache"]);

    const startTime = performance.now();

    resolving
      .then(function (resolved) {
        resolvedResult(hostname, resolved, startTime);
        searchField.value = "";
      })
      .catch((error) => {
        console.error(
          `Error attempting to resolve ${hostname}; error: ${error}`
        );
      });
  }

  searchField.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      resolveHostFromSubmission();
    }
  });

  searchButton.addEventListener("click", resolveHostFromSubmission);
});
