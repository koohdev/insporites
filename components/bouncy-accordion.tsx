"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";

const OPEN_TRANSITION: Transition = {
  type: "spring",
  duration: 0.75,
  bounce: 0.15,
};

const CLOSE_TRANSITION: Transition = {
  type: "spring",
  duration: 0.7,
  bounce: 0.0,
};

const CHEVRON_OPEN_TRANSITION: Transition = {
  type: "spring",
  duration: 0.55,
  bounce: 0.2,
};

const CHEVRON_CLOSE_TRANSITION: Transition = {
  type: "spring",
  duration: 0.55,
  bounce: 0.0,
};

function playAudioTone(type: "open" | "close" | "check" | "uncheck") {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const now = ctx.currentTime;

    if (type === "check") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(1080, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "uncheck") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.05);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "open") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.045);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } else {
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.045);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    }
  } catch {
    // Ignore audio context errors
  }
}

interface OnboardingStep {
  id: string;
  title: string;
  completed: boolean;
  description: string;
  nextId: string | null;
}

const DEFAULT_ITEMS: OnboardingStep[] = [
  {
    id: "profile",
    title: "Complete your profile",
    completed: true,
    description:
      "Your display name, avatar, and account preferences have been configured.",
    nextId: "workspace",
  },
  {
    id: "workspace",
    title: "Set up your workspace",
    completed: false,
    description:
      "Customize your workspace URL, brand themes, and default timezone settings.",
    nextId: "team",
  },
  {
    id: "team",
    title: "Invite your team",
    completed: false,
    description:
      "Send email invites to team members or create shareable join links with role access.",
    nextId: "integrations",
  },
  {
    id: "integrations",
    title: "Connect integrations",
    completed: false,
    description:
      "Link GitHub, Slack, Jira, and Figma to sync real-time updates across developer tools.",
    nextId: "workflow",
  },
  {
    id: "workflow",
    title: "Create your first workflow",
    completed: false,
    description:
      "Automate deployment checks, PR reviews, and Slack alerts with custom triggers.",
    nextId: "notifications",
  },
  {
    id: "notifications",
    title: "Set up notifications",
    completed: false,
    description:
      "Choose which events send email, push, and desktop alerts to stay up to date.",
    nextId: null,
  },
];

function CompletedIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{
        height: "18px",
        width: "18px",
        marginTop: "4px",
        overflow: "clip",
        flexShrink: 0,
      }}
    >
      <path
        d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
        fill="oklch(20.5% 0 0)"
      />
    </svg>
  );
}

function IncompleteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{
        height: "20px",
        width: "20px",
        marginTop: "4px",
        overflow: "clip",
        flexShrink: 0,
      }}
    >
      <path
        d="M8.56 3.69a9 9 0 0 0 -2.92 1.95"
        fill="none"
        stroke="oklab(55.6% 0 0 / 40%)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.69 8.56a9 9 0 0 0 -.69 3.44"
        fill="none"
        stroke="oklab(55.6% 0 0 / 40%)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.69 15.44a9 9 0 0 0 1.95 2.92"
        fill="none"
        stroke="oklab(55.6% 0 0 / 40%)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.56 20.31a9 9 0 0 0 3.44 .69"
        fill="none"
        stroke="oklab(55.6% 0 0 / 40%)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.44 20.31a9 9 0 0 0 2.92 -1.95"
        fill="none"
        stroke="oklab(55.6% 0 0 / 40%)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.31 15.44a9 9 0 0 0 .69 -3.44"
        fill="none"
        stroke="oklab(55.6% 0 0 / 40%)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.31 8.56a9 9 0 0 0 -1.95 -2.92"
        fill="none"
        stroke="oklab(55.6% 0 0 / 40%)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.44 3.69a9 9 0 0 0 -3.44 -.69"
        fill="none"
        stroke="oklab(55.6% 0 0 / 40%)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BouncyRow({
  item,
  open,
  index,
  startsGroup,
  endsGroup,
  separatedFromPrevious,
  reduce,
  onToggle,
  onToggleComplete,
  onContinueStep,
}: {
  item: OnboardingStep;
  open: boolean;
  index: number;
  startsGroup: boolean;
  endsGroup: boolean;
  separatedFromPrevious: boolean;
  reduce: boolean | null;
  onToggle: () => void;
  onToggleComplete: (e: React.MouseEvent) => void;
  onContinueStep: (item: OnboardingStep) => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const updateHeight = () => {
      setContentHeight(node.offsetHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [item.completed]);

  const activeTransition = reduce
    ? { duration: 0 }
    : open
      ? OPEN_TRANSITION
      : CLOSE_TRANSITION;

  const chevronTransition = reduce
    ? { duration: 0 }
    : open
      ? CHEVRON_OPEN_TRANSITION
      : CHEVRON_CLOSE_TRANSITION;

  return (
    <motion.div
      layout="position"
      initial={false}
      style={{
        marginTop: separatedFromPrevious ? 12 : 0,
        borderTop:
          index > 0 && !separatedFromPrevious
            ? "1px solid #E5E5E5"
            : "1px solid transparent",
      }}
      transition={activeTransition}
    >
      <motion.div
        layout
        data-state={open ? "open" : "closed"}
        initial={false}
        animate={{
          borderTopLeftRadius: startsGroup ? 10 : 0,
          borderTopRightRadius: startsGroup ? 10 : 0,
          borderBottomLeftRadius: endsGroup ? 10 : 0,
          borderBottomRightRadius: endsGroup ? 10 : 0,
          boxShadow: open
            ? "0px 4px 12px rgba(0,0,0,0.06)"
            : "0px 0px 0px rgba(0,0,0,0)",
          backgroundColor: "#FFFFFF",
          outline: open ? "1px solid #E5E5E5" : "1px solid transparent",
        }}
        transition={activeTransition}
        style={{
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <button
          type="button"
          aria-expanded={open}
          onClick={onToggle}
          style={{
            alignItems: "center",
            boxSizing: "border-box",
            display: "flex",
            gap: "12px",
            justifyContent: "space-between",
            paddingBlock: "12px",
            paddingLeft: "16px",
            paddingRight: "8px",
            width: "100%",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            outline: "none",
          }}
        >
          <div
            style={{
              boxSizing: "border-box",
              display: "flex",
              gap: "12px",
              width: "100%",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{ boxSizing: "border-box", flexShrink: 0 }}
              onClick={onToggleComplete}
              title={
                item.completed ? "Mark as incomplete" : "Mark as completed"
              }
            >
              {item.completed ? <CompletedIcon /> : <IncompleteIcon />}
            </div>
            <div
              style={{ boxSizing: "border-box", flexGrow: 1, marginTop: "2px" }}
            >
              <div
                style={{
                  boxSizing: "border-box",
                  color: item.completed ? "#171717" : "#0A0A0A",
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "16px",
                  fontWeight: 600,
                  lineHeight: "150%",
                  textDecoration: item.completed ? "line-through" : "none",
                  opacity: item.completed ? 0.75 : 1,
                }}
              >
                {item.title}
              </div>
            </div>
          </div>
          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            transition={chevronTransition}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              aria-hidden="true"
              fontSize="16px"
              style={{
                height: "16px",
                width: "16px",
                overflow: "clip",
                display: "block",
              }}
            >
              <path
                d="M9 6l6 6l-6 6"
                fill="none"
                stroke="oklch(55.6% 0 0)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </button>

        {/* Content Expansion Area */}
        <motion.div
          initial={false}
          animate={{ height: open ? contentHeight : 0 }}
          transition={activeTransition}
          style={{ overflow: "hidden" }}
        >
          <motion.div
            ref={contentRef}
            animate={{ opacity: open ? 1 : 0 }}
            transition={
              reduce
                ? { duration: 0 }
                : open
                  ? { duration: 0.3, ease: [0.25, 1, 0.5, 1] }
                  : { duration: 0.2, ease: [0.5, 0, 0.75, 0] }
            }
            style={{
              paddingLeft: "48px",
              paddingRight: "16px",
              paddingBottom: "16px",
              paddingTop: "2px",
            }}
          >
            <p
              style={{
                color: "#525252",
                fontFamily: "system-ui, sans-serif",
                fontSize: "14px",
                lineHeight: "150%",
                margin: "0 0 14px 0",
              }}
            >
              {item.description}
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onContinueStep(item);
              }}
              style={{
                width: "100%",
                backgroundColor: "#0A0A0A",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "6px",
                padding: "10px 16px",
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "system-ui, sans-serif",
                cursor: "pointer",
                textAlign: "center",
                display: "block",
                transition: "background-color 0.15s ease",
              }}
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function BouncyAccordion() {
  const reduce = useReducedMotion();
  const [items, setItems] = useState<OnboardingStep[]>(DEFAULT_ITEMS);
  const [activeId, setActiveId] = useState<string | null>("workspace");

  const completedCount = items.filter((i) => i.completed).length;
  const totalCount = items.length;
  const progressPercent = (completedCount / totalCount) * 100;
  const dashOffset = 100 - progressPercent;

  const activeIndex = items.findIndex((i) => i.id === activeId);

  const toggleItem = (id: string) => {
    setActiveId((prev) => {
      const isClosing = prev === id;
      if (isClosing) {
        playAudioTone("close");
        return null;
      } else {
        playAudioTone("open");
        return id;
      }
    });
  };

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems((prev) => {
      const targetItem = prev.find((item) => item.id === id);
      const willBeCompleted = !targetItem?.completed;

      if (willBeCompleted) {
        playAudioTone("check");
      } else {
        playAudioTone("uncheck");
      }

      const nextItems = prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );

      const allFinished = nextItems.every((i) => i.completed);

      if (allFinished) {
        playAudioTone("close");
        setActiveId(null);
      } else if (willBeCompleted && targetItem?.nextId) {
        playAudioTone("open");
        setActiveId(targetItem.nextId);
      }

      return nextItems;
    });
  };

  const handleContinueStep = (item: OnboardingStep) => {
    let nextItems = items;
    if (!item.completed) {
      playAudioTone("check");
      nextItems = items.map((i) =>
        i.id === item.id ? { ...i, completed: true } : i
      );
      setItems(nextItems);
    }

    const allFinished = nextItems.every((i) => i.completed);

    if (allFinished) {
      playAudioTone("close");
      setActiveId(null);
    } else if (item.nextId) {
      playAudioTone("open");
      setActiveId(item.nextId);
    }
  };

  return (
    <motion.div
      layout
      transition={
        reduce
          ? { duration: 0 }
          : activeId
            ? OPEN_TRANSITION
            : CLOSE_TRANSITION
      }
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "#E5E5E5",
        borderRadius: "10px",
        borderStyle: "solid",
        borderWidth: "1px",
        boxShadow: "#0000000D 0px 1px 2px",
        boxSizing: "border-box",
        fontSynthesis: "none",
        MozOsxFontSmoothing: "grayscale",
        padding: "16px",
        WebkitFontSmoothing: "antialiased",
        width: "448px",
        maxWidth: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          alignItems: "center",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
          marginRight: "8px",
        }}
      >
        <div
          style={{
            boxSizing: "border-box",
            color: "#0A0A0A",
            fontFamily: "system-ui, sans-serif",
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "150%",
            marginLeft: "8px",
            textWrap: "balance",
          }}
        >
          Get started with 404
        </div>
        <div
          style={{
            alignItems: "center",
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <svg
            height="14"
            viewBox="0 0 14 14"
            width="14"
            fontSize="16px"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              height: "14px",
              width: "14px",
              overflow: "clip",
              rotate: "-90deg",
              flexShrink: "0",
              transformOrigin: "50% 50%",
            }}
          >
            <circle
              cx="7"
              cy="7"
              pathLength="100"
              r="6"
              fontSize="16px"
              fill="none"
              stroke="oklch(97% 0 0)"
              strokeWidth="2"
              style={{ boxSizing: "border-box", transformOrigin: "0px 0px" }}
            />
            <motion.circle
              cx="7"
              cy="7"
              pathLength="100"
              r="6"
              fontSize="16px"
              fill="none"
              stroke="oklch(20.5% 0 0)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="100"
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ type: "spring", duration: 0.8, bounce: 0.15 }}
              style={{ boxSizing: "border-box", transformOrigin: "0px 0px" }}
            />
          </svg>
          <div
            style={{
              boxSizing: "border-box",
              color: "#737373",
              fontFamily: "system-ui, sans-serif",
              fontSize: "14px",
              lineHeight: "142.857%",
              marginLeft: "6px",
              marginRight: "12px",
            }}
          >
            {completedCount} / {totalCount} completed
          </div>
          <div
            style={{
              alignItems: "center",
              borderColor: "#00000000",
              borderRadius: "10px",
              borderStyle: "solid",
              borderWidth: "1px",
              boxSizing: "border-box",
              display: "flex",
              flexShrink: "0",
              height: "24px",
              justifyContent: "center",
              width: "24px",
              cursor: "pointer",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              aria-hidden="true"
              fontSize="14px"
              fontWeight="500"
              style={{
                height: "16px",
                flexShrink: "0",
                width: "16px",
                overflow: "clip",
              }}
            >
              <path
                d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"
                fontSize="14px"
                fontWeight="500"
                fill="none"
                stroke="oklch(14.5% 0 0)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ boxSizing: "border-box", transformOrigin: "0px 0px" }}
              />
              <path
                d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"
                fontSize="14px"
                fontWeight="500"
                fill="none"
                stroke="oklch(14.5% 0 0)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ boxSizing: "border-box", transformOrigin: "0px 0px" }}
              />
              <path
                d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"
                fontSize="14px"
                fontWeight="500"
                fill="none"
                stroke="oklch(14.5% 0 0)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ boxSizing: "border-box", transformOrigin: "0px 0px" }}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Accordion Container */}
      <motion.div layout style={{ boxSizing: "border-box" }}>
        {items.map((item, index) => {
          const open = activeId === item.id;
          const previousIsOpen = activeIndex === index - 1;
          const nextIsOpen = activeIndex === index + 1;
          const startsGroup = open || index === 0 || previousIsOpen;
          const endsGroup = open || index === items.length - 1 || nextIsOpen;
          const separatedFromPrevious = index > 0 && (open || previousIsOpen);

          return (
            <BouncyRow
              key={item.id}
              item={item}
              open={open}
              index={index}
              startsGroup={startsGroup}
              endsGroup={endsGroup}
              separatedFromPrevious={separatedFromPrevious}
              reduce={reduce}
              onToggle={() => toggleItem(item.id)}
              onToggleComplete={(e) => toggleComplete(item.id, e)}
              onContinueStep={handleContinueStep}
            />
          );
        })}
      </motion.div>

      {/* Completion Banner when 100% finished */}
      {completedCount === totalCount && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: "16px",
            backgroundColor: "#F4F4F5",
            border: "1px solid #E4E4E7",
            borderRadius: "8px",
            padding: "14px 16px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#18181B",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            🎉 All set! Onboarding Complete
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "#71717A",
              margin: "4px 0 10px 0",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Your 404 workspace is fully configured and ready for your team.
          </p>
          <button
            type="button"
            style={{
              width: "100%",
              backgroundColor: "#09090B",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "6px",
              padding: "10px 16px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Launch Dashboard →
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default BouncyAccordion;
