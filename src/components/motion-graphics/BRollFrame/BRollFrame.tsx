import React from "react";
import { AbsoluteFill, Img, interpolate, spring, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { SPRING_SNAPPY } from "../../../utils/animations";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { resolveMGPosition } from "../shared/positioning";
import { useMGPhase } from "../shared/useMGPhase";
import type {
  BRollFrameAspectRatio,
  BRollFrameMediaType,
  BRollFrameProps,
  BRollFrameVariant,
} from "./types";

// ---------------------------------------------------------------------------
// BRollFrame — framed image/video pop-in, supports 1-3 photo stack.
// ---------------------------------------------------------------------------
//
// Per-photo choreography (entrance @ 30fps, 14 frames):
//   0-14  scale 0.9 → 1.0 via SPRING_SNAPPY (gentle overshoot = "placed")
//   0-10  opacity 0 → 1
//   Rotation lands from (rest - 3.5°) → rest over the spring window.
//   Drop shadow tightens-to-diffused during entrance.
//
// Stack stagger: each photo starts `STAGGER_FRAMES` after the previous one
// (back photo lands first, front photo last) — same animation per photo.
//
// Hold: shared sub-pixel sinusoidal Y parallax (~2px).
//
// Exit (10 frames, shared across the whole stack):
//   scale 1.0 → 1.05, opacity 1 → 0, rotation drifts rest → (rest - 2.5°).
//
// Stack mode (2-3 sources): photos are absolutely positioned on the same
// anchor with different rest rotations to produce a scrapbook pile. Caption
// renders only on the FRONT (top) photo.

// Frames between each photo's entrance start when rendering a stack.
// 18 frames @ 30fps = 600ms — photo N-1 fully settles (14f), then a short
// ~130ms beat, then photo N starts landing. Feels like a hand placing them.
const STAGGER_FRAMES = 18;

const ASPECT_MAP: Record<BRollFrameAspectRatio, number> = {
  "16:9": 16 / 9,
  "4:5": 4 / 5,
  "1:1": 1,
  "9:16": 9 / 16,
};

// Per-photo rest rotations by stack size. Index 0 = back, last = front.
const REST_ROTATIONS: Record<number, number[]> = {
  1: [-2.5],
  2: [-5, 3],
  3: [-7, 4, -1.5],
};


// Diffused drop shadow — interpolated from tight (entrance start) to diffused
// (hold/exit). Large blur + low opacity = editorial, not default-Figma harsh.
function buildShadow(variant: BRollFrameVariant, diffuseProgress: number): string {
  const baseBlur = variant === "polaroid" ? 30 : 24;
  const maxBlur = variant === "polaroid" ? 90 : 64;
  const baseY = variant === "polaroid" ? 10 : 8;
  const maxY = variant === "polaroid" ? 34 : 22;
  const baseSpread = 0;
  const maxSpread = variant === "polaroid" ? -6 : -4;

  const blur = interpolate(diffuseProgress, [0, 1], [baseBlur, maxBlur]);
  const y = interpolate(diffuseProgress, [0, 1], [baseY, maxY]);
  const spread = interpolate(diffuseProgress, [0, 1], [baseSpread, maxSpread]);

  const alpha = variant === "polaroid" ? 0.32 : 0.26;

  return `0 ${y}px ${blur}px ${spread}px rgba(0,0,0,${alpha})`;
}

interface FrameRenderArgs {
  src: string;
  mediaType: BRollFrameMediaType;
  variant: BRollFrameVariant;
  mediaWidth: number;
  mediaHeight: number;
  shadow: string;
  caption?: string;
}

function renderFrame({
  src,
  mediaType,
  variant,
  mediaWidth,
  mediaHeight,
  shadow,
  caption,
}: FrameRenderArgs): React.ReactNode {
  const POLAROID_BORDER = 28;
  // Dedicated caption area below the image — the polaroid's "white line"
  // where the hand-written caption sits, vertically centered.
  const POLAROID_CAPTION_AREA_HEIGHT = 88;
  const WHITE_BORDER = 4;

  const mediaStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  const mediaNode =
    mediaType === "video" ? (
      <Video src={src} style={mediaStyle} />
    ) : (
      <Img src={src} style={mediaStyle} />
    );

  if (variant === "polaroid") {
    return (
      <div
        style={{
          backgroundColor: "#FAFAF7",
          paddingTop: POLAROID_BORDER,
          paddingLeft: POLAROID_BORDER,
          paddingRight: POLAROID_BORDER,
          // No paddingBottom — the caption area below takes care of it.
          borderRadius: 4,
          boxShadow: shadow,
          width: mediaWidth + POLAROID_BORDER * 2,
        }}
      >
        <div
          style={{
            width: mediaWidth,
            height: mediaHeight,
            overflow: "hidden",
            borderRadius: 2,
            backgroundColor: "#000",
          }}
        >
          {mediaNode}
        </div>
        {/* Caption area — fixed height so every photo's frame is identical,
            caption text vertically centered on the polaroid's bottom white line. */}
        <div
          style={{
            height: POLAROID_CAPTION_AREA_HEIGHT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT_FAMILIES.caveatBrush,
            fontSize: 44,
            color: "#1A1A1A",
            lineHeight: 1,
            letterSpacing: "0.01em",
            textAlign: "center",
          }}
        >
          {caption ?? ""}
        </div>
      </div>
    );
  }

  if (variant === "white-border") {
    return (
      <div>
        <div
          style={{
            padding: WHITE_BORDER,
            backgroundColor: "#FFFFFF",
            borderRadius: 14,
            boxShadow: shadow,
            width: mediaWidth + WHITE_BORDER * 2,
          }}
        >
          <div
            style={{
              width: mediaWidth,
              height: mediaHeight,
              overflow: "hidden",
              borderRadius: 10,
              backgroundColor: "#000",
            }}
          >
            {mediaNode}
          </div>
        </div>
        {caption ? (
          <div
            style={{
              marginTop: 16,
              fontFamily: FONT_FAMILIES.inter,
              fontSize: 30,
              fontWeight: 500,
              color: "#B8B8B8",
              letterSpacing: "0.06em",
              textAlign: "center",
            }}
          >
            {caption}
          </div>
        ) : null}
      </div>
    );
  }

  // clean
  return (
    <div>
      <div
        style={{
          width: mediaWidth,
          height: mediaHeight,
          overflow: "hidden",
          borderRadius: 14,
          backgroundColor: "#000",
          boxShadow: shadow,
        }}
      >
        {mediaNode}
      </div>
      {caption ? (
        <div
          style={{
            marginTop: 16,
            fontFamily: FONT_FAMILIES.inter,
            fontSize: 30,
            fontWeight: 500,
            color: "#B8B8B8",
            letterSpacing: "0.06em",
            textAlign: "center",
          }}
        >
          {caption}
        </div>
      ) : null}
    </div>
  );
}

export const BRollFrame: React.FC<BRollFrameProps> = ({
  startMs,
  durationMs,
  enterFrames,
  exitFrames,
  src,
  mediaType = "image",
  aspectRatio = "16:9",
  width = 540,
  variant = "clean",
  caption,
  anchor,
  offsetX,
  offsetY,
  scale: positionScale,
}) => {
  const { containerStyle, wrapperStyle } = resolveMGPosition({
    anchor,
    offsetX,
    offsetY,
    scale: positionScale,
  });
  const { fps } = useVideoConfig();
  const { visible, localFrame, exitProgress } = useMGPhase(
    { startMs, durationMs, enterFrames, exitFrames },
    { defaultEnterFrames: 14, defaultExitFrames: 10 },
  );

  if (!visible) return null;

  // --- Sources → normalized array (max 3) ---------------------------------
  const sources = (Array.isArray(src) ? src : [src]).slice(0, 3);
  const count = sources.length as 1 | 2 | 3;

  // --- Geometry ------------------------------------------------------------
  const ratio = ASPECT_MAP[aspectRatio];
  const mediaWidth = width;
  const mediaHeight = width / ratio;

  // --- Shared hold / exit state --------------------------------------------
  const parallaxY = Math.sin(localFrame * 0.05) * 2;
  const exitScale = interpolate(exitProgress, [0, 1], [1, 1.05]);
  const exitOpacity = 1 - exitProgress;
  const isExiting = exitProgress > 0;
  const exitRotOffset = interpolate(exitProgress, [0, 1], [0, -2.5]);

  // --- Per-photo entrance --------------------------------------------------
  //
  // Each photo N starts entering at frame `N * STAGGER_FRAMES`, so the back
  // photo lands first and the front photo lands last. Before a photo's
  // stagger point its local frame is negative, which clamps opacity to 0
  // and holds scale/rotation at their starting values — i.e. invisible.
  interface PhotoAnim {
    scale: number;
    opacity: number;
    diffuseProgress: number;
    entryRotOffset: number;
  }
  const computePhotoAnim = (index: number): PhotoAnim => {
    const photoLocalFrame = localFrame - index * STAGGER_FRAMES;
    const enterSpring = spring({
      fps,
      frame: photoLocalFrame,
      config: SPRING_SNAPPY,
      durationInFrames: 14,
    });
    return {
      scale: interpolate(enterSpring, [0, 1], [0.9, 1.0]),
      opacity: interpolate(photoLocalFrame, [0, 10], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
      diffuseProgress: interpolate(photoLocalFrame, [0, 14], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
      entryRotOffset: interpolate(enterSpring, [0, 1], [-3.5, 0]),
    };
  };

  const rotationForPhoto = (index: number, entryRotOffset: number): number => {
    if (count === 1 && variant !== "polaroid") return 0;
    const rest = REST_ROTATIONS[count][index];
    return rest + (isExiting ? exitRotOffset : entryRotOffset);
  };

  // Resolve caption per photo index. A single string applies to every photo;
  // an array matches index-for-index.
  const captionForPhoto = (index: number): string | undefined => {
    if (caption === undefined) return undefined;
    if (typeof caption === "string") return caption;
    return caption[index];
  };

  // Shared exit scale + parallax apply to the whole stack together. Per-photo
  // entrance (scale, opacity, rotation, shadow diffuse) is applied inside.
  const motionTransform = `translateY(${parallaxY}px) scale(${exitScale})`;

  return (
    <AbsoluteFill style={containerStyle}>
      <div style={wrapperStyle}>
      <div
        style={{
          transform: motionTransform,
          opacity: exitOpacity,
        }}
      >
        {/* Stack container — front photo defines flow, others overlay on top */}
        <div style={{ position: "relative" }}>
          {sources.map((photoSrc, i) => {
            const isFront = i === count - 1;
            const anim = computePhotoAnim(i);
            const rotation = rotationForPhoto(i, anim.entryRotOffset);
            const shadow = buildShadow(variant, anim.diffuseProgress);
            return (
              <div
                key={i}
                style={{
                  position: isFront ? "relative" : "absolute",
                  top: isFront ? undefined : 0,
                  left: isFront ? undefined : 0,
                  transform: `rotate(${rotation}deg) scale(${anim.scale})`,
                  transformOrigin: "center center",
                  opacity: anim.opacity,
                  zIndex: i + 1,
                }}
              >
                {renderFrame({
                  src: photoSrc,
                  mediaType,
                  variant,
                  mediaWidth,
                  mediaHeight,
                  shadow,
                  caption: captionForPhoto(i),
                })}
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </AbsoluteFill>
  );
};
