import { simulate } from "@/lib/dev/eventLoop";
import { LESSONS } from "@/lib/dev/eventLoopLessons";

const EXPECTED: Record<string, string[]> = {
  "call-stack": ["start", "third", "end"],
  timers: ["start", "end", "timeout"],
  microtasks: ["start", "end", "promise", "timeout"],
  "next-tick": ["sync", "nextTick", "promise", "timeout"],
  "poll-check": ["start", "file read", "immediate", "timeout"],
  starvation: ["micro 3", "micro 2", "micro 1", "timeout"],
  boss: [
    "script",
    "end",
    "nextTick",
    "promise",
    "tick in promise",
    "timeout",
    "promise in timeout",
    "immediate",
  ],
};

describe("event loop simulator", () => {
  it.each(LESSONS.map((l) => [l.id, l] as const))("lesson %s prints the expected order", (id, lesson) => {
    expect(simulate(lesson.program).output).toEqual(EXPECTED[id]);
  });

  it("covers every lesson", () => {
    expect(LESSONS.map((l) => l.id).sort()).toEqual(Object.keys(EXPECTED).sort());
  });

  it("distractors never equal the correct order", () => {
    for (const l of LESSONS) {
      const correct = EXPECTED[l.id].join("|");
      for (const d of l.distractors) expect(d.join("|")).not.toBe(correct);
    }
  });

  it("every frame has a valid highlighted line and ends with done", () => {
    for (const l of LESSONS) {
      const { frames } = simulate(l.program);
      expect(frames.at(-1)?.note.key).toBe("done");
      for (const f of frames) {
        if (f.line !== null) {
          expect(f.line).toBeGreaterThanOrEqual(1);
          expect(f.line).toBeLessThanOrEqual(l.code.length);
        }
      }
    }
  });

  it("is deterministic and bounded", () => {
    const a = simulate(LESSONS[6].program);
    const b = simulate(LESSONS[6].program);
    expect(a.frames).toEqual(b.frames);
    expect(a.frames.length).toBeLessThanOrEqual(501);
  });
});
