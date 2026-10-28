import gsap from "gsap";

export function createAgentAnimation(section: HTMLElement, stage: HTMLElement) {
  const find = (name: string) => section.querySelector<HTMLElement>(`[data-team-${name}]`)!;
  const cards = Array.from(section.querySelectorAll<HTMLElement>("[data-team-card]"));
  const mobile = stage.clientWidth <= 900;
  const centerCard = (card: HTMLElement) => {
    const bounds = card.getBoundingClientRect();
    const stageBounds = stage.getBoundingClientRect();
    return stageBounds.left + stageBounds.width / 2 - bounds.left - bounds.width / 2;
  };
  const animation = gsap.timeline();
  animation.fromTo(find("task"), { xPercent: -50, yPercent: -50, x: 0, y: 0, autoAlpha: 0, scale: .92 }, { autoAlpha: 1, scale: 1, duration: .25 }, 0)
    .to(find("task"), { top: mobile ? "20%" : "23%", scale: mobile ? .94 : .85, duration: .3, ease: "power2.inOut" }, .45)
    .to(find("dispatch"), { autoAlpha: 0, duration: .16 }, .54)
    .fromTo(cards, { x: (_index, card) => centerCard(card), y: -65, scale: .65, autoAlpha: 0 }, { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: .35, stagger: .045, ease: "power2.inOut" }, .72)
    .fromTo(section.querySelectorAll("[data-team-code]"), { autoAlpha: 0, clipPath: "inset(0 100% 0 0)" }, { autoAlpha: 1, clipPath: "inset(0 0% 0 0)", duration: .22, stagger: .12, ease: "none" }, 1.4)
    .fromTo(find("cursor"), { x: 30, y: 20, autoAlpha: 0 }, { x: -12, y: -12, autoAlpha: 1, duration: .22, ease: "power2.inOut" }, 2.5)
    .to(find("cursor"), { scale: .75, duration: .07, yoyo: true, repeat: 1 }, 2.76)
    .to(find("test-image"), { scale: 1.4, duration: .18, ease: "power2.inOut" }, 2.9)
    .to(find("test-image"), { scale: 1, duration: .18, ease: "power2.inOut" }, 3.34)
    .fromTo(section.querySelectorAll("[data-team-check]"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .12, stagger: .3 }, 3.12)
    .fromTo(find("finding"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .18 }, 4.18)
    .fromTo(find("return"), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .16 }, 4.48)
    .to(find("file"), { autoAlpha: 0, duration: .15 }, 5.05)
    .fromTo(find("incoming"), { autoAlpha: 0, y: 5 }, { autoAlpha: 1, y: 0, duration: .18 }, 5.05)
    .to(find("return"), { autoAlpha: 0, duration: .15 }, 5.05)
    .fromTo(find("fix"), { autoAlpha: 0, clipPath: "inset(0 100% 0 0)" }, { autoAlpha: 1, clipPath: "inset(0 0% 0 0)", duration: .3, ease: "none" }, 5.28)
    .fromTo(find("revision"), { autoAlpha: 0, y: 7 }, { autoAlpha: 1, y: 0, duration: .16 }, 5.62)
    .to(find("finding"), { autoAlpha: 0, duration: .15 }, 6.18)
    .fromTo(find("approved"), { autoAlpha: 0, y: 7 }, { autoAlpha: 1, y: 0, duration: .18 }, 6.38)
    .to([find("task"), find("heading")], { autoAlpha: 0, y: -18, duration: .25 }, 7.1)
    .to(cards, { x: (_index, card) => centerCard(card), y: -30, scale: .5, autoAlpha: 0, duration: .3, stagger: .035, ease: "power2.inOut" }, 7.12)
    .fromTo(find("result"), { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: .94, y: 25 }, { autoAlpha: 1, scale: 1, y: 0, duration: .3, ease: "power2.out" }, 7.44);
  const highlight = (role: string | null, at: number, warning = false) => {
    for (const card of cards) {
      const active = role === null || card.hasAttribute(`data-team-${role}`);
      animation.set(card, { attr: { "data-active": String(active) } }, at)
        .to(card, {
          opacity: active ? 1 : .55,
          borderColor: active ? (warning ? "#b78a3f" : "#397c50") : "#bdcdbf",
          boxShadow: active ? `inset 0 0 0 1px ${warning ? "#b78a3f" : "#397c50"}` : "inset 0 0 0 1px transparent",
          duration: .16,
        }, at);
    }
  };
  highlight("developer", 1.2);
  highlight("tester", 2.3);
  highlight("reviewer", 3.98, true);
  highlight("developer", 4.85);
  highlight("reviewer", 5.98);
  highlight(null, 6.85);
  return animation;
}
