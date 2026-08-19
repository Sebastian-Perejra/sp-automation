.about-history__card {
  isolation: isolate;
}

.about-history__card::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  border-radius: inherit;
  opacity: 0;
  background:
    radial-gradient(
      280px circle
      at
      var(--history-x, 50%)
      var(--history-y, 50%),
      rgba(166, 255, 72, 0.09),
      transparent 68%
    );
  transition:
    opacity 0.25s ease;
}

.about-history__card:hover::after,
.about-history__card.is-active::after {
  opacity: 1;
}

.about-history__card {
  opacity: 0.68;
  transform:
    translateY(0)
    scale(0.985);
}

.about-history__card.is-active {
  opacity: 1;
  transform:
    translateY(-6px)
    scale(1.012);
  border-color:
    rgba(166, 255, 72, 0.34);
  box-shadow:
    0 28px 80px
    rgba(0, 0, 0, 0.28),
    0 0 40px
    rgba(87, 151, 94, 0.08),
    inset 0 1px 0
    rgba(255, 255, 255, 0.035);
}

.about-history__card:hover {
  opacity: 1;
}

.about-experience__lines path {
  transition:
    opacity 0.28s ease,
    stroke 0.28s ease,
    stroke-width 0.28s ease;
}

.about-experience__lines path.is-dimmed {
  opacity: 0.18;
}

.about-experience__lines path.is-active {
  opacity: 1;
  stroke:
    rgba(166, 255, 72, 0.78);
  stroke-width: 1.6;
  filter:
    drop-shadow(
      0 0 7px
      rgba(166, 255, 72, 0.28)
    );
}

.about-experience__node {
  transition:
    opacity 0.28s ease,
    transform 0.28s ease,
    border-color 0.28s ease,
    background 0.28s ease;
}

.about-experience__node.is-dimmed {
  opacity: 0.32;
}

.about-experience__node.is-active {
  z-index: 9;
  opacity: 1;
  border-color:
    rgba(166, 255, 72, 0.48);
  background:
    linear-gradient(
      180deg,
      rgba(20, 37, 23, 0.99),
      rgba(8, 16, 10, 0.98)
    );
  box-shadow:
    0 18px 45px
    rgba(0, 0, 0, 0.22),
    0 0 28px
    rgba(166, 255, 72, 0.06);
}

.about-experience__core {
  transition:
    box-shadow 0.3s ease,
    border-color 0.3s ease,
    transform 0.3s ease;
}

.about-experience__core.is-active {
  border-color:
    rgba(166, 255, 72, 0.48);
  box-shadow:
    0 0 75px
    rgba(89, 160, 98, 0.22),
    inset 0 0 38px
    rgba(166, 255, 72, 0.07);
}

.about-hero__portrait-image {
  transform:
    translate3d(
      var(--hero-x, 0px),
      var(--hero-y, 0px),
      0
    )
    scale(1.025);
  transition:
    transform 0.18s ease-out;
}

.about-system-node--one {
  transform:
    translate3d(
      calc(var(--hero-x, 0px) * -0.7),
      calc(var(--hero-y, 0px) * -0.7),
      0
    );
}

.about-system-node--two {
  transform:
    translate3d(
      calc(var(--hero-x, 0px) * 0.8),
      calc(var(--hero-y, 0px) * 0.8),
      0
    );
}

.about-system-node--three {
  transform:
    translate3d(
      calc(var(--hero-x, 0px) * -0.45),
      calc(var(--hero-y, 0px) * 0.6),
      0
    );
}

.about-system-node--five {
  transform:
    translate3d(
      calc(var(--hero-x, 0px) * 0.55),
      calc(var(--hero-y, 0px) * -0.5),
      0
    );
}

@media (max-width: 850px) {
  .about-history__card {
    opacity: 1;
    transform: none;
  }

  .about-history__card.is-active {
    transform: none;
  }

  .about-hero__portrait-image {
    transform: none;
  }

  .about-system-node--one,
  .about-system-node--two,
  .about-system-node--three,
  .about-system-node--five {
    transform: none;
  }
}
