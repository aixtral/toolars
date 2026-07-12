export const MOBILE_RELEASE_GATE_VISUAL_IDS = [
  "04",
  ...Array.from({ length: 27 }, (_item, index) => String(index + 31).padStart(2, "0"))
];

export const DESKTOP_HOTSPOT_VISUAL_IDS = ["01", "02", "03", "05", "28", "29"];

export function getReleaseGateDefinitions() {
  return [
    {
      id: "mobile-28",
      ids: MOBILE_RELEASE_GATE_VISUAL_IDS,
      maxRatio: Number(process.env.TOOLARS_RELEASE_GATE_MOBILE_MAX_RATIO ?? "0.115")
    },
    {
      id: "desktop-hotspots",
      ids: DESKTOP_HOTSPOT_VISUAL_IDS,
      maxRatio: Number(process.env.TOOLARS_RELEASE_GATE_DESKTOP_MAX_RATIO ?? "0.13")
    }
  ];
}

export function selectReleaseGateDefinitions(scope = process.env.TOOLARS_RELEASE_GATE_SCOPE ?? "all") {
  const gates = getReleaseGateDefinitions();
  if (scope === "mobile") return gates.filter((gate) => gate.id === "mobile-28");
  if (scope === "desktop-hotspots") return gates.filter((gate) => gate.id === "desktop-hotspots");
  return gates;
}
