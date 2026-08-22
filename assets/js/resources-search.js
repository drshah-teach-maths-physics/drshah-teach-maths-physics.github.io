(() => {
  "use strict";

  const input = document.getElementById("resource-search");
  const results = document.getElementById("resource-search-results");
  const status = document.getElementById("resource-search-status");

  if (!input || !results || !status) return;

  let data = [];

  const normalise = value =>
    String(value || "")
      .toLocaleLowerCase()
      .normalize("NFKD");

  const clearResults = () => {
    results.replaceChildren();
    results.hidden = true;
    status.textContent = "";
  };

  const makeResult = item => {
    const link = document.createElement("a");
    link.className = "resource10-search-result";
    link.href = item.page;

    const main = document.createElement("span");
    main.className = "resource10-search-result-main";

    const name = document.createElement("strong");
    name.textContent = item.name;

    const meta = document.createElement("small");
    meta.textContent = `${item.audience} › ${item.category}`;

    main.append(name, meta);

    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";

    link.append(main, arrow);

    return link;
  };

  fetch("/resources/resources-index.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Resource index unavailable");
      }
      return response.json();
    })
    .then(json => {
      data = Array.isArray(json) ? json : [];
    })
    .catch(() => {
      status.textContent =
        "Search is unavailable at the moment. Browse by category below.";
    });

  input.addEventListener("input", () => {
    const query = normalise(input.value.trim());

    if (query.length < 2) {
      clearResults();
      return;
    }

    const terms = query.split(/\s+/).filter(Boolean);

    const matches = data
      .map(item => {
        const haystack = normalise([
          item.name,
          item.description,
          item.audience,
          item.category,
          item.source
        ].join(" "));

        const matchesAll = terms.every(
          term => haystack.includes(term)
        );

        if (!matchesAll) return null;

        const name = normalise(item.name);

        let score = 2;

        if (name === query) score = 0;
        else if (name.startsWith(query)) score = 1;

        return { item, score };
      })
      .filter(Boolean)
      .sort((a, b) =>
        a.score - b.score ||
        a.item.name.localeCompare(b.item.name)
      );

    results.replaceChildren();

    if (!matches.length) {
      status.textContent =
        `No resources found for “${input.value.trim()}”.`;
      results.hidden = true;
      return;
    }

    const shown = matches.slice(0, 12);

    shown.forEach(({ item }) => {
      results.appendChild(makeResult(item));
    });

    results.hidden = false;

    status.textContent =
      matches.length > shown.length
        ? `${matches.length} resources found. Showing the first ${shown.length}.`
        : `${matches.length} resource${matches.length === 1 ? "" : "s"} found.`;
  });
})();
