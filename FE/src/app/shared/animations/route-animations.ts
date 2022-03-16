import { animate, group, query, style } from "@angular/animations";

const ANIMATION_SPEED = "500ms";

export const slideLeft = [
  query(":enter, :leave", style({ position: "fixed", width: "100%" })),
  group([
    query(":enter", [
      style({ transform: "translateX(150%)" }),
      animate(
        `${ANIMATION_SPEED} ease-in-out`,
        style({ transform: "translateX(0)" })
      )
    ]),
    query(":leave", [
      animate(
        `${ANIMATION_SPEED} ease-in-out`,
        style({ transform: "translateX(-150%)" })
      )
    ])
  ])
];

export const slideRight = [
  group([
    query(":enter, :leave", style({ position: "fixed", width: "100%" })),
    query(":enter", [
      style({ transform: "translateX(-150%)" }),
      animate(
        `${ANIMATION_SPEED} ease-in-out`,
        style({ transform: "translateX(0%)" })
      )
    ]),
    query(":leave", [
      animate(
        `${ANIMATION_SPEED} ease-in-out`,
        style({ transform: "translateX(150%)" })
      )
    ])
  ])
];
