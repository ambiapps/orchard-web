// Plays Orchard's loop in the hero: a commit lands on main, it builds,
// and the build is installed on each device in turn.
(() => {
  const tree = document.querySelector(".tree");
  if (!tree || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const commits = tree.querySelector("[data-commits]");
  const devices = [...tree.querySelectorAll("[data-devices] li")];
  const status = tree.querySelector("[data-status]");

  const messages = [
    "Fix crash when sharing photos",
    "Add haptics to the timer",
    "Support Dynamic Type in settings",
    "Speed up cold launch",
    "New onboarding illustrations",
    "Refresh the widget every 15 minutes",
  ];
  let next = 0;
  let visible = true;

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const sha = () => Math.random().toString(16).slice(2, 9).padEnd(7, "0");

  function say(text, tone) {
    status.textContent = text;
    if (tone) status.dataset.tone = tone;
    else delete status.dataset.tone;
  }

  function addCommit() {
    const id = sha();
    const li = document.createElement("li");
    li.className = "new";
    li.innerHTML = '<span class="fruit"></span><code></code><span class="msg"></span>';
    li.querySelector("code").textContent = id;
    li.querySelector(".msg").textContent = messages[next++ % messages.length];
    commits.append(li);
    while (commits.children.length > 3) commits.firstElementChild.remove();
    return id;
  }

  async function run() {
    const id = addCommit();
    tree.dataset.run = "running";
    devices.forEach((d) => (d.dataset.state = "queued"));
    say(`New commit ${id}`, "busy");

    await wait(1400);
    say("Building for macOS, iOS and visionOS", "busy");
    devices.forEach((d) => (d.dataset.state = "building"));

    await wait(2600);
    say("Installing", "busy");
    for (const d of devices) {
      d.dataset.state = "installing";
      await wait(700);
      d.dataset.state = "installed";
    }

    tree.dataset.run = "fresh";
    say("Up to date", "done");
  }

  new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(tree);

  (async () => {
    await wait(1500);
    for (;;) {
      while (!visible || document.hidden) await wait(500);
      await run();
      await wait(5000);
    }
  })();
})();
