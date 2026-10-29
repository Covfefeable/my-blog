import gsap from "gsap";

export function createAgentAnimation(section: HTMLElement, stage: HTMLElement) {
  const find = (name: string) => section.querySelector<HTMLElement>(`[data-team-${name}]`)!;
  const roles = ["developer", "reviewer", "tester"];
  const cards = roles.map(find);
  const mobile = stage.clientWidth <= 900;
  const animation = gsap.timeline();
  const ring = find("complete-ring") as unknown as SVGGeometryElement;
  const check = find("complete-check") as unknown as SVGGeometryElement;
  const ringLength = ring.getTotalLength();
  const checkLength = check.getTotalLength();
  const frontOrder = [...roles];
  const focus = (role: string, at: number) => {
    const alreadyFront = frontOrder[0] === role;
    frontOrder.splice(frontOrder.indexOf(role), 1);
    frontOrder.unshift(role);
    frontOrder.forEach((name, rank) => {
      const card = find(name);
      const active = rank === 0;
      animation.set(card, { attr: { "data-active": String(active) } }, at);
      if (active && !alreadyFront) {
        const pull = mobile ? Math.max(24, (stage.clientWidth - card.offsetWidth) / 2 - 18) : card.offsetWidth * .8;
        animation.to(card, { x: pull, y: -30, rotation: mobile ? 4 : 8, duration: .14, ease: "power2.in" }, at)
          .set(card, { zIndex: 5 }, at + .14)
          .to(card, { x: 0, y: 0, z: 0, scale: 1, rotation: 0, duration: .2, ease: "power2.out" }, at + .14);
      } else {
        animation.set(card, { zIndex: 3 - rank }, at + .14)
          .to(card, { x: rank * (mobile ? 15 : 22), y: rank * 15, z: -rank * 16, scale: 1 - rank * .035, rotation: rank === 0 ? 0 : (rank % 2 ? -3 : 4), duration: .3, ease: "power2.inOut" }, at);
      }
      animation.to(card, { opacity: 1, borderColor: active ? "#397c50" : "#b7c8ba", boxShadow: active ? "inset 0 0 0 1px #397c50,0 18px 36px #203d231a" : "0 4px 14px #203d2312", duration: .16 }, at);
    });
  };
  animation.fromTo(find("task"), { xPercent: -50, yPercent: -50, x: 0, y: 0, autoAlpha: 0, scale: .92 }, { autoAlpha: 1, scale: 1, duration: .25 }, 0)
    .to(find("task"), { top: mobile ? "20%" : "22%", scale: mobile ? .94 : .85, duration: .3, ease: "power2.inOut" }, .45)
    .to(find("dispatch"), { autoAlpha: 0, duration: .16 }, .54)
    .fromTo(find("thoughts"), { autoAlpha: 0 }, { autoAlpha: 1, duration: .3 }, .72)
    .fromTo(section.querySelectorAll("[data-team-code]"), { autoAlpha: 0, clipPath: "inset(0 100% 0 0)" }, { autoAlpha: 1, clipPath: "inset(0 0% 0 0)", duration: .2, stagger: .1, ease: "none" }, 1.58)
    .fromTo(find("lens"), { autoAlpha: 0, x: -10, y: 0 }, { autoAlpha: 1, x: 30, y: 12, duration: .22, ease: "power2.inOut" }, 2.66)
    .to(find("lens"), { x: 70, y: 42, duration: .3, ease: "power2.inOut" }, 2.94)
    .to(find("lens"), { x: 25, y: 68, duration: .25, ease: "power2.inOut" }, 3.28)
    .to(find("lens"), { autoAlpha: 0, duration: .12 }, 3.56)
    .fromTo(find("review-pass"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .16 }, 3.65)
    .fromTo(find("cursor"), { x: 30, y: 20, autoAlpha: 0 }, { x: -12, y: -12, autoAlpha: 1, duration: .18 }, 4.34)
    .to(find("cursor"), { scale: .75, duration: .07, yoyo: true, repeat: 1 }, 4.55)
    .fromTo(find("preview"), { autoAlpha: 0 }, { autoAlpha: 1, duration: .1 }, 4.65)
    .fromTo(find("test-image"), { scale: .65 }, { scale: 1, duration: .2, ease: "power2.out" }, 4.65)
    .fromTo(find("scroll-probe"), { autoAlpha: 0 }, { autoAlpha: 1, duration: .08 }, 4.85)
    .fromTo(section.querySelector("[data-team-check]"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .12 }, 4.8)
    .to(find("test-page"), { y: -22, duration: .22, ease: "power2.inOut" }, 4.85)
    .fromTo(find("finding"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .16 }, 5.06)
    .to(find("tester"), { borderColor: "#b78a3f", duration: .12 }, 5.06)
    .fromTo(find("return"), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .14 }, 5.3)
    .to(find("file"), { autoAlpha: 0, duration: .12 }, 5.96)
    .fromTo(find("incoming"), { autoAlpha: 0, y: 5 }, { autoAlpha: 1, y: 0, duration: .14 }, 5.96)
    .to(find("return"), { autoAlpha: 0, duration: .12 }, 5.96)
    .fromTo(find("fix"), { autoAlpha: 0, clipPath: "inset(0 100% 0 0)" }, { autoAlpha: 1, clipPath: "inset(0 0% 0 0)", duration: .25, ease: "none" }, 6.12)
    .fromTo(find("revision"), { autoAlpha: 0, y: 7 }, { autoAlpha: 1, y: 0, duration: .15 }, 6.42)
    .to(find("finding"), { autoAlpha: 0, duration: .15 }, 7.05)
    .to(find("scroll-probe"), { autoAlpha: 1, duration: .08 }, 6.98)
    .to(find("scroll-probe"), { autoAlpha: 0, duration: .1 }, 7.18)
    .to(find("cursor"), { left: "94%", top: "5%", x: 0, y: 0, duration: .2 }, 6.98)
    .to(find("preview"), { autoAlpha: 0, duration: .12 }, 7.22)
    .to(find("preview"), { autoAlpha: 1, duration: .12 }, 7.58)
    .fromTo(section.querySelectorAll("[data-team-check]")[1], { display: "none", autoAlpha: 0, y: 8 }, { display: "flex", autoAlpha: 1, y: 0, duration: .12 }, 7.15)
    .to(find("test-page"), { y: 0, duration: .15 }, 7.18)
    .fromTo(find("approved"), { autoAlpha: 0, y: 7 }, { autoAlpha: 1, y: 0, duration: .16 }, 7.38)
    .to([find("task"), find("heading")], { autoAlpha: 0, y: -18, duration: .2 }, 7.78)
    .to(find("thoughts"), { autoAlpha: 0, duration: .25 }, 7.78)
    .to([find("developer"), find("reviewer")], { autoAlpha: 0, scale: .9, duration: .25 }, 7.8)
    .to([find("test-header"), find("tests"), find("test-outcome"), find("cursor")], { autoAlpha: 0, duration: .18 }, 7.8)
    .to(find("test-header"), { height: 0, paddingTop: 0, paddingBottom: 0, borderBottomWidth: 0, duration: .45 }, 7.9)
    .to(find("test-body"), { padding: 0, duration: .45 }, 7.9)
    .to(find("deck"), { width: Math.min(stage.clientWidth * .88, 740), height: Math.min(stage.clientHeight * .44, 400), top: "27%", duration: .65, ease: "power2.inOut" }, 7.9)
    .to(find("test-canvas"), { height: Math.min(stage.clientHeight * .44, 400), borderRadius: 10, borderWidth: 0, duration: .65, ease: "power2.inOut" }, 7.9)
    .fromTo(find("result"), { top: stage.clientHeight * .27 + Math.min(stage.clientHeight * .44, 400) + 28, xPercent: 0, y: 0, autoAlpha: 0 }, { autoAlpha: 1, duration: 0 }, 8.7)
    .fromTo(ring, { strokeDasharray: ringLength, strokeDashoffset: ringLength }, { strokeDashoffset: 0, duration: .46, ease: "none" }, 8.7)
    .fromTo(check, { strokeDasharray: checkLength, strokeDashoffset: checkLength }, { strokeDashoffset: 0, duration: .3, ease: "none" }, 9.18);
  const celebration = gsap.timeline({ paused: true });
  section.querySelectorAll<HTMLElement>("[data-team-confetti]").forEach((piece, index) => {
    const angle = Math.PI + ((index * 2.39996) % Math.PI);
    const distance = (mobile ? 90 : 140) + (index * 47 % (mobile ? 100 : 170));
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    celebration.fromTo(piece, { x: 0, y: 0, autoAlpha: 0, scale: .4, rotation: index * 31 }, {
      keyframes: [
        { x: x * .72, y, autoAlpha: 1, scale: 1, rotation: index * 31 + 130, duration: .4, ease: "power2.out" },
        { x, y: y * .15 + 110, autoAlpha: 0, scale: .7, rotation: index * 31 + 400, duration: .9, ease: "power1.in" },
      ],
    }, (index % 5) * .025);
  });
  const deck = find("deck");
  // Account for each card's low transform origin so its small starting face
  // is centered on the host, rather than above the destination stack.
  const sourceY = stage.clientHeight * (mobile ? .2 : .22) - deck.offsetTop - deck.offsetHeight * (.85 - .35 * .16);
  [...cards].reverse().forEach((card, dealIndex) => {
    const rank = cards.indexOf(card);
    const at = .66 + dealIndex * .09;
    animation.set(card, { zIndex: 3 - rank }, at)
      .fromTo(card, { x: 0, y: sourceY, z: 0, scale: .16, rotation: -12 + dealIndex * 9, autoAlpha: 0 }, {
        x: rank * (mobile ? 15 : 22), y: rank * 15, z: -rank * 16,
        scale: 1 - rank * .035, rotation: rank === 0 ? 0 : rank % 2 ? -3 : 4,
        autoAlpha: 1, duration: .34, ease: "power2.out",
      }, at);
  });
  focus("developer", 1.2);
  focus("reviewer", 2.3);
  focus("tester", 3.98);
  focus("developer", 5.6);
  focus("tester", 6.7);
  // Give voice input its own opening beat, then preserve the existing workflow.
  animation.shiftChildren(1.2, true, .45);
  const taskText = find("task-text");
  animation.fromTo(taskText, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.12, ease: `steps(${Array.from(taskText.textContent || "").length})` }, .22);
  animation.fromTo(find("dispatch"), { autoAlpha: 0 }, { autoAlpha: 1, duration: .1 }, 1.4)
    .fromTo(find("voice"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .15 }, .08)
    .fromTo(find("voice"), { attr: { "data-speaking": "false" } }, { attr: { "data-speaking": "true" }, duration: .001 }, .18)
    .set(find("voice"), { attr: { "data-speaking": "false" } }, 1.48)
    .to(find("voice"), { autoAlpha: 0, y: -12, duration: .2 }, 1.48);
  let celebrated = false;
  animation.to({}, { duration: .85 }, 10.68);
  animation.eventCallback("onUpdate", () => {
    const time = animation.time();
    const voice = find("voice");
    voice.dataset.voiceProgress = String(gsap.utils.clamp(0, 1, (time - .18) / 1.3));
    voice.dispatchEvent(new Event("voice-progress"));
    if (time < 9.9) celebrated = false;
    if (time >= 10.72 && !celebrated) {
      celebrated = true;
      celebration.restart();
    }
  });
  return animation;
}
