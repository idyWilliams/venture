(() => {
  var e = {};
  (e.id = 2363),
    (e.ids = [2363]),
    (e.modules = {
      3295: (e) => {
        "use strict";
        e.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");
      },
      10846: (e) => {
        "use strict";
        e.exports = require("next/dist/compiled/next-server/app-page.runtime.prod.js");
      },
      17569: (e, s, t) => {
        "use strict";
        t.r(s), t.d(s, { default: () => x });
        var a = t(60687),
          r = t(43210),
          n = t(16189),
          i = t(55192),
          l = t(24934),
          d = t(85763),
          o = t(89667),
          c = t(34729),
          m = t(80013);
        function x() {
          (0, n.useParams)().id;
          let [e, s] = (0, r.useState)(null),
            [t, x] = (0, r.useState)([]),
            [u, p] = (0, r.useState)(""),
            [h, f] = (0, r.useState)(!0),
            [j, g] = (0, r.useState)(null),
            [v, b] = (0, r.useState)(!1),
            [N, y] = (0, r.useState)(""),
            [w, C] = (0, r.useState)(""),
            [D, k] = (0, r.useState)(null),
            R = "user-123",
            I = "Jane Investor",
            S = async () => {
              if (u.trim() && e)
                try {
                  let e = {
                    id: `msg-${t.length + 1}`,
                    senderId: R,
                    senderName: I,
                    content: u,
                    createdAt: new Date().toISOString(),
                  };
                  x([...t, e]), p("");
                } catch (e) {
                  console.error("Error sending message:", e),
                    alert("Failed to send message");
                }
            },
            P = async (a) => {
              if ((a.preventDefault(), N && w && D && e)) {
                b(!0);
                try {
                  let a = {
                    id: `doc-${e.documents.length + 1}`,
                    name: N,
                    fileUrl: URL.createObjectURL(D),
                    documentType: w,
                    createdAt: new Date().toISOString(),
                  };
                  s({ ...e, documents: [...e.documents, a] });
                  let r = {
                    id: `msg-${t.length + 1}`,
                    senderId: R,
                    senderName: I,
                    content: `I uploaded a new document: ${N}`,
                    createdAt: new Date().toISOString(),
                  };
                  x([...t, r]),
                    y(""),
                    C(""),
                    k(null),
                    setTimeout(() => {
                      b(!1);
                    }, 1e3);
                } catch (e) {
                  console.error("Error uploading document:", e),
                    alert("Failed to upload document"),
                    b(!1);
                }
              }
            };
          return h
            ? (0, a.jsx)("div", {
                className: "container mx-auto px-4 py-8 max-w-6xl",
                children: (0, a.jsx)("div", {
                  className: "flex justify-center items-center h-64",
                  children: (0, a.jsxs)("div", {
                    className: "animate-pulse flex flex-col items-center",
                    children: [
                      (0, a.jsx)("div", {
                        className: "h-16 w-16 rounded-full bg-blue-200 mb-6",
                      }),
                      (0, a.jsx)("div", {
                        className: "h-6 w-48 bg-blue-200 rounded mb-4",
                      }),
                      (0, a.jsx)("div", {
                        className: "h-4 w-64 bg-blue-100 rounded",
                      }),
                    ],
                  }),
                }),
              })
            : j || !e
            ? (0, a.jsx)("div", {
                className: "container mx-auto px-4 py-8 max-w-6xl",
                children: (0, a.jsxs)(i.Zp, {
                  children: [
                    (0, a.jsx)(i.aR, {
                      children: (0, a.jsx)(i.ZB, { children: "Error" }),
                    }),
                    (0, a.jsxs)(i.Wu, {
                      children: [
                        (0, a.jsx)("p", {
                          className: "text-red-500 mb-4",
                          children: j || "Failed to load deal room",
                        }),
                        (0, a.jsx)(l.$, {
                          onClick: () => window.location.reload(),
                          children: "Try Again",
                        }),
                      ],
                    }),
                  ],
                }),
              })
            : (0, a.jsxs)("div", {
                className: "container mx-auto px-4 py-8 max-w-6xl",
                children: [
                  (0, a.jsxs)("div", {
                    className: "mb-8",
                    children: [
                      (0, a.jsx)("h1", {
                        className: "text-3xl font-bold mb-2",
                        children: e.name,
                      }),
                      (0, a.jsxs)("div", {
                        className: "flex flex-wrap gap-2 items-center mb-4",
                        children: [
                          (0, a.jsx)("span", {
                            className: `px-3 py-1 rounded-full text-sm font-medium ${
                              "active" === e.status
                                ? "bg-green-100 text-green-800"
                                : "pending" === e.status
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`,
                            children:
                              e.status.charAt(0).toUpperCase() +
                              e.status.slice(1),
                          }),
                          (0, a.jsxs)("span", {
                            className: "text-gray-500",
                            children: [
                              "Project: ",
                              (0, a.jsx)("span", {
                                className: "font-medium",
                                children: e.project.title,
                              }),
                            ],
                          }),
                          (0, a.jsxs)("span", {
                            className: "text-gray-500",
                            children: [
                              "Industry: ",
                              (0, a.jsx)("span", {
                                className: "font-medium",
                                children: e.project.industry,
                              }),
                            ],
                          }),
                          (0, a.jsxs)("span", {
                            className: "text-gray-500",
                            children: [
                              "Funding: ",
                              (0, a.jsxs)("span", {
                                className: "font-medium",
                                children: [
                                  "$",
                                  e.project.fundingAmount?.toLocaleString(),
                                ],
                              }),
                            ],
                          }),
                          (0, a.jsxs)("span", {
                            className: "text-gray-500",
                            children: [
                              "Equity: ",
                              (0, a.jsxs)("span", {
                                className: "font-medium",
                                children: [e.project.equity, "%"],
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, a.jsx)("p", {
                        className: "text-gray-700",
                        children: e.project.description,
                      }),
                    ],
                  }),
                  (0, a.jsxs)(d.tU, {
                    defaultValue: "conversations",
                    children: [
                      (0, a.jsxs)(d.j7, {
                        className: "mb-6",
                        children: [
                          (0, a.jsx)(d.Xi, {
                            value: "conversations",
                            children: "Conversations",
                          }),
                          (0, a.jsx)(d.Xi, {
                            value: "documents",
                            children: "Documents",
                          }),
                          (0, a.jsx)(d.Xi, {
                            value: "participants",
                            children: "Participants",
                          }),
                          (0, a.jsx)(d.Xi, {
                            value: "details",
                            children: "Deal Details",
                          }),
                        ],
                      }),
                      (0, a.jsx)(d.av, {
                        value: "conversations",
                        children: (0, a.jsxs)(i.Zp, {
                          children: [
                            (0, a.jsxs)(i.aR, {
                              children: [
                                (0, a.jsx)(i.ZB, { children: "Conversations" }),
                                (0, a.jsx)(i.BT, {
                                  children:
                                    "Secure communication between deal participants",
                                }),
                              ],
                            }),
                            (0, a.jsx)(i.Wu, {
                              children: (0, a.jsxs)("div", {
                                className: "flex flex-col h-[500px]",
                                children: [
                                  (0, a.jsx)("div", {
                                    className:
                                      "flex-1 overflow-y-auto mb-4 space-y-4 p-4 border rounded-md",
                                    children: t.map((e) =>
                                      (0, a.jsx)(
                                        "div",
                                        {
                                          className: `flex ${
                                            e.senderId === R
                                              ? "justify-end"
                                              : "justify-start"
                                          }`,
                                          children: (0, a.jsxs)("div", {
                                            className: `max-w-[70%] rounded-lg p-3 ${
                                              e.senderId === R
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-100 text-gray-900"
                                            }`,
                                            children: [
                                              (0, a.jsx)("div", {
                                                className:
                                                  "font-medium text-sm mb-1",
                                                children: e.senderName,
                                              }),
                                              (0, a.jsx)("p", {
                                                className: "text-sm",
                                                children: e.content,
                                              }),
                                              (0, a.jsx)("div", {
                                                className: `text-xs mt-1 ${
                                                  e.senderId === R
                                                    ? "text-blue-200"
                                                    : "text-gray-500"
                                                }`,
                                                children: new Date(
                                                  e.createdAt
                                                ).toLocaleString(),
                                              }),
                                            ],
                                          }),
                                        },
                                        e.id
                                      )
                                    ),
                                  }),
                                  (0, a.jsxs)("div", {
                                    className: "flex gap-2",
                                    children: [
                                      (0, a.jsx)(c.T, {
                                        value: u,
                                        onChange: (e) => p(e.target.value),
                                        placeholder:
                                          "Type your message here...",
                                        className: "flex-1",
                                      }),
                                      (0, a.jsx)(l.$, {
                                        onClick: S,
                                        children: "Send",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            }),
                          ],
                        }),
                      }),
                      (0, a.jsx)(d.av, {
                        value: "documents",
                        children: (0, a.jsxs)(i.Zp, {
                          children: [
                            (0, a.jsxs)(i.aR, {
                              children: [
                                (0, a.jsx)(i.ZB, { children: "Documents" }),
                                (0, a.jsx)(i.BT, {
                                  children:
                                    "Securely share and manage deal documents",
                                }),
                              ],
                            }),
                            (0, a.jsxs)(i.Wu, {
                              children: [
                                (0, a.jsx)("div", {
                                  className:
                                    "grid grid-cols-1 md:grid-cols-3 gap-4 mb-8",
                                  children: e.documents.map((e) =>
                                    (0, a.jsx)(
                                      i.Zp,
                                      {
                                        children: (0, a.jsx)(i.Wu, {
                                          className: "pt-6",
                                          children: (0, a.jsxs)("div", {
                                            className:
                                              "flex flex-col items-center",
                                            children: [
                                              (0, a.jsxs)("svg", {
                                                xmlns:
                                                  "http://www.w3.org/2000/svg",
                                                width: "24",
                                                height: "24",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                stroke: "currentColor",
                                                strokeWidth: "2",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                className:
                                                  "w-12 h-12 text-blue-500 mb-3",
                                                children: [
                                                  (0, a.jsx)("path", {
                                                    d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",
                                                  }),
                                                  (0, a.jsx)("polyline", {
                                                    points: "14 2 14 8 20 8",
                                                  }),
                                                ],
                                              }),
                                              (0, a.jsx)("h3", {
                                                className: "font-medium mb-1",
                                                children: e.name,
                                              }),
                                              (0, a.jsx)("p", {
                                                className:
                                                  "text-sm text-gray-500 mb-3",
                                                children:
                                                  e.documentType
                                                    .replace("_", " ")
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                  e.documentType
                                                    .replace("_", " ")
                                                    .slice(1),
                                              }),
                                              (0, a.jsx)("div", {
                                                className:
                                                  "text-xs text-gray-400 mb-4",
                                                children: new Date(
                                                  e.createdAt
                                                ).toLocaleDateString(),
                                              }),
                                              (0, a.jsx)(l.$, {
                                                variant: "outline",
                                                size: "sm",
                                                children: (0, a.jsxs)("a", {
                                                  href: e.fileUrl,
                                                  target: "_blank",
                                                  rel: "noopener noreferrer",
                                                  className:
                                                    "flex items-center",
                                                  children: [
                                                    (0, a.jsxs)("svg", {
                                                      xmlns:
                                                        "http://www.w3.org/2000/svg",
                                                      width: "16",
                                                      height: "16",
                                                      viewBox: "0 0 24 24",
                                                      fill: "none",
                                                      stroke: "currentColor",
                                                      strokeWidth: "2",
                                                      strokeLinecap: "round",
                                                      strokeLinejoin: "round",
                                                      className: "mr-2",
                                                      children: [
                                                        (0, a.jsx)("path", {
                                                          d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
                                                        }),
                                                        (0, a.jsx)("polyline", {
                                                          points:
                                                            "7 10 12 15 17 10",
                                                        }),
                                                        (0, a.jsx)("line", {
                                                          x1: "12",
                                                          y1: "15",
                                                          x2: "12",
                                                          y2: "3",
                                                        }),
                                                      ],
                                                    }),
                                                    "Download",
                                                  ],
                                                }),
                                              }),
                                            ],
                                          }),
                                        }),
                                      },
                                      e.id
                                    )
                                  ),
                                }),
                                (0, a.jsxs)("div", {
                                  className: "border-t pt-6",
                                  children: [
                                    (0, a.jsx)("h3", {
                                      className: "font-medium text-lg mb-4",
                                      children: "Upload New Document",
                                    }),
                                    (0, a.jsxs)("form", {
                                      onSubmit: P,
                                      className: "space-y-4",
                                      children: [
                                        (0, a.jsxs)("div", {
                                          className:
                                            "grid grid-cols-1 md:grid-cols-2 gap-4",
                                          children: [
                                            (0, a.jsxs)("div", {
                                              children: [
                                                (0, a.jsx)(m.J, {
                                                  htmlFor: "documentName",
                                                  children: "Document Name",
                                                }),
                                                (0, a.jsx)(o.p, {
                                                  id: "documentName",
                                                  value: N,
                                                  onChange: (e) =>
                                                    y(e.target.value),
                                                  required: !0,
                                                }),
                                              ],
                                            }),
                                            (0, a.jsxs)("div", {
                                              children: [
                                                (0, a.jsx)(m.J, {
                                                  htmlFor: "documentType",
                                                  children: "Document Type",
                                                }),
                                                (0, a.jsxs)("select", {
                                                  id: "documentType",
                                                  value: w,
                                                  onChange: (e) =>
                                                    C(e.target.value),
                                                  className:
                                                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2",
                                                  required: !0,
                                                  children: [
                                                    (0, a.jsx)("option", {
                                                      value: "",
                                                      children:
                                                        "Select document type",
                                                    }),
                                                    (0, a.jsx)("option", {
                                                      value: "term_sheet",
                                                      children: "Term Sheet",
                                                    }),
                                                    (0, a.jsx)("option", {
                                                      value: "contract",
                                                      children: "Contract",
                                                    }),
                                                    (0, a.jsx)("option", {
                                                      value: "financial",
                                                      children:
                                                        "Financial Documents",
                                                    }),
                                                    (0, a.jsx)("option", {
                                                      value: "pitch_deck",
                                                      children: "Pitch Deck",
                                                    }),
                                                    (0, a.jsx)("option", {
                                                      value: "due_diligence",
                                                      children: "Due Diligence",
                                                    }),
                                                    (0, a.jsx)("option", {
                                                      value: "legal",
                                                      children:
                                                        "Legal Documents",
                                                    }),
                                                    (0, a.jsx)("option", {
                                                      value: "other",
                                                      children: "Other",
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                        (0, a.jsxs)("div", {
                                          children: [
                                            (0, a.jsx)(m.J, {
                                              htmlFor: "documentFile",
                                              children: "File",
                                            }),
                                            (0, a.jsx)(o.p, {
                                              id: "documentFile",
                                              type: "file",
                                              onChange: (e) => {
                                                e.target.files &&
                                                  e.target.files[0] &&
                                                  k(e.target.files[0]);
                                              },
                                              required: !0,
                                            }),
                                          ],
                                        }),
                                        (0, a.jsx)(l.$, {
                                          type: "submit",
                                          disabled: v,
                                          children: v
                                            ? "Uploading..."
                                            : "Upload Document",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      }),
                      (0, a.jsx)(d.av, {
                        value: "participants",
                        children: (0, a.jsxs)(i.Zp, {
                          children: [
                            (0, a.jsxs)(i.aR, {
                              children: [
                                (0, a.jsx)(i.ZB, { children: "Participants" }),
                                (0, a.jsx)(i.BT, {
                                  children: "People involved in this deal",
                                }),
                              ],
                            }),
                            (0, a.jsxs)(i.Wu, {
                              children: [
                                (0, a.jsxs)("div", {
                                  className: "mb-6",
                                  children: [
                                    (0, a.jsx)("h3", {
                                      className: "font-medium text-lg mb-3",
                                      children: "Deal Manager",
                                    }),
                                    (0, a.jsx)(i.Zp, {
                                      children: (0, a.jsxs)(i.Wu, {
                                        className: "pt-6 flex items-center",
                                        children: [
                                          (0, a.jsx)("div", {
                                            className:
                                              "w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-lg mr-4",
                                            children: e.manager.name.charAt(0),
                                          }),
                                          (0, a.jsxs)("div", {
                                            children: [
                                              (0, a.jsx)("h4", {
                                                className: "font-medium",
                                                children: e.manager.name,
                                              }),
                                              (0, a.jsx)("p", {
                                                className:
                                                  "text-sm text-gray-500",
                                                children: e.manager.email,
                                              }),
                                              (0, a.jsx)("p", {
                                                className:
                                                  "text-xs text-gray-400 mt-1",
                                                children: e.manager.role,
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                    }),
                                  ],
                                }),
                                (0, a.jsxs)("div", {
                                  children: [
                                    (0, a.jsx)("h3", {
                                      className: "font-medium text-lg mb-3",
                                      children: "Participants",
                                    }),
                                    (0, a.jsx)("div", {
                                      className: "space-y-3",
                                      children: e.participants.map((e) =>
                                        (0, a.jsx)(
                                          i.Zp,
                                          {
                                            children: (0, a.jsxs)(i.Wu, {
                                              className:
                                                "pt-6 flex items-center",
                                              children: [
                                                (0, a.jsx)("div", {
                                                  className:
                                                    "w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium text-lg mr-4",
                                                  children: e.name.charAt(0),
                                                }),
                                                (0, a.jsxs)("div", {
                                                  children: [
                                                    (0, a.jsx)("h4", {
                                                      className: "font-medium",
                                                      children: e.name,
                                                    }),
                                                    (0, a.jsx)("p", {
                                                      className:
                                                        "text-sm text-gray-500",
                                                      children: e.email,
                                                    }),
                                                    (0, a.jsx)("p", {
                                                      className:
                                                        "text-xs text-gray-400 mt-1",
                                                      children:
                                                        "founder" === e.role
                                                          ? "Founder"
                                                          : "investor" ===
                                                            e.role
                                                          ? "Investor"
                                                          : e.role,
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            }),
                                          },
                                          e.id
                                        )
                                      ),
                                    }),
                                  ],
                                }),
                                (0, a.jsx)("div", {
                                  className: "mt-8 pt-6 border-t",
                                  children: (0, a.jsxs)(l.$, {
                                    variant: "outline",
                                    children: [
                                      (0, a.jsxs)("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        width: "16",
                                        height: "16",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        className: "mr-2",
                                        children: [
                                          (0, a.jsx)("path", {
                                            d: "M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2",
                                          }),
                                          (0, a.jsx)("circle", {
                                            cx: "8.5",
                                            cy: "7",
                                            r: "4",
                                          }),
                                          (0, a.jsx)("line", {
                                            x1: "20",
                                            y1: "8",
                                            x2: "20",
                                            y2: "14",
                                          }),
                                          (0, a.jsx)("line", {
                                            x1: "23",
                                            y1: "11",
                                            x2: "17",
                                            y2: "11",
                                          }),
                                        ],
                                      }),
                                      "Invite Participant",
                                    ],
                                  }),
                                }),
                              ],
                            }),
                          ],
                        }),
                      }),
                      (0, a.jsx)(d.av, {
                        value: "details",
                        children: (0, a.jsxs)(i.Zp, {
                          children: [
                            (0, a.jsxs)(i.aR, {
                              children: [
                                (0, a.jsx)(i.ZB, { children: "Deal Details" }),
                                (0, a.jsx)(i.BT, {
                                  children:
                                    "Key information about the investment deal",
                                }),
                              ],
                            }),
                            (0, a.jsxs)(i.Wu, {
                              children: [
                                (0, a.jsxs)("div", {
                                  className:
                                    "grid grid-cols-1 md:grid-cols-2 gap-8",
                                  children: [
                                    (0, a.jsxs)("div", {
                                      children: [
                                        (0, a.jsx)("h3", {
                                          className: "font-medium text-lg mb-4",
                                          children: "Project Information",
                                        }),
                                        (0, a.jsxs)("div", {
                                          className: "space-y-3",
                                          children: [
                                            (0, a.jsxs)("div", {
                                              children: [
                                                (0, a.jsx)("p", {
                                                  className:
                                                    "text-sm text-gray-500",
                                                  children: "Project Title",
                                                }),
                                                (0, a.jsx)("p", {
                                                  className: "font-medium",
                                                  children: e.project.title,
                                                }),
                                              ],
                                            }),
                                            (0, a.jsxs)("div", {
                                              children: [
                                                (0, a.jsx)("p", {
                                                  className:
                                                    "text-sm text-gray-500",
                                                  children: "Industry",
                                                }),
                                                (0, a.jsx)("p", {
                                                  className: "font-medium",
                                                  children: e.project.industry,
                                                }),
                                              ],
                                            }),
                                            (0, a.jsxs)("div", {
                                              children: [
                                                (0, a.jsx)("p", {
                                                  className:
                                                    "text-sm text-gray-500",
                                                  children: "Funding Stage",
                                                }),
                                                (0, a.jsx)("p", {
                                                  className: "font-medium",
                                                  children:
                                                    e.project.fundingStage,
                                                }),
                                              ],
                                            }),
                                            (0, a.jsxs)("div", {
                                              children: [
                                                (0, a.jsx)("p", {
                                                  className:
                                                    "text-sm text-gray-500",
                                                  children: "Funding Amount",
                                                }),
                                                (0, a.jsxs)("p", {
                                                  className: "font-medium",
                                                  children: [
                                                    "$",
                                                    e.project.fundingAmount?.toLocaleString() ||
                                                      "Not specified",
                                                  ],
                                                }),
                                              ],
                                            }),
                                            (0, a.jsxs)("div", {
                                              children: [
                                                (0, a.jsx)("p", {
                                                  className:
                                                    "text-sm text-gray-500",
                                                  children: "Equity Offering",
                                                }),
                                                (0, a.jsx)("p", {
                                                  className: "font-medium",
                                                  children:
                                                    null !== e.project.equity
                                                      ? `${e.project.equity}%`
                                                      : "Not specified",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                    (0, a.jsxs)("div", {
                                      children: [
                                        (0, a.jsx)("h3", {
                                          className: "font-medium text-lg mb-4",
                                          children: "Founder Information",
                                        }),
                                        (0, a.jsxs)("div", {
                                          className: "space-y-3",
                                          children: [
                                            (0, a.jsxs)("div", {
                                              children: [
                                                (0, a.jsx)("p", {
                                                  className:
                                                    "text-sm text-gray-500",
                                                  children: "Founder Name",
                                                }),
                                                (0, a.jsx)("p", {
                                                  className: "font-medium",
                                                  children:
                                                    e.project.founder.name,
                                                }),
                                              ],
                                            }),
                                            (0, a.jsxs)("div", {
                                              children: [
                                                (0, a.jsx)("p", {
                                                  className:
                                                    "text-sm text-gray-500",
                                                  children: "Company",
                                                }),
                                                (0, a.jsx)("p", {
                                                  className: "font-medium",
                                                  children:
                                                    e.project.founder
                                                      .companyName ||
                                                    "Not specified",
                                                }),
                                              ],
                                            }),
                                            (0, a.jsxs)("div", {
                                              children: [
                                                (0, a.jsx)("p", {
                                                  className:
                                                    "text-sm text-gray-500",
                                                  children: "Contact Email",
                                                }),
                                                (0, a.jsx)("p", {
                                                  className: "font-medium",
                                                  children:
                                                    e.project.founder.email,
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                (0, a.jsxs)("div", {
                                  className: "mt-8 pt-6 border-t",
                                  children: [
                                    (0, a.jsx)("h3", {
                                      className: "font-medium text-lg mb-4",
                                      children: "Deal Status",
                                    }),
                                    (0, a.jsxs)("div", {
                                      className: "flex items-center gap-4",
                                      children: [
                                        (0, a.jsx)("div", {
                                          className: `px-4 py-2 rounded-md ${
                                            "active" === e.status
                                              ? "bg-green-100 text-green-800"
                                              : "pending" === e.status
                                              ? "bg-yellow-100 text-yellow-800"
                                              : "bg-gray-100 text-gray-800"
                                          }`,
                                          children:
                                            e.status.charAt(0).toUpperCase() +
                                            e.status.slice(1),
                                        }),
                                        (0, a.jsxs)("div", {
                                          className: "space-x-2",
                                          children: [
                                            (0, a.jsx)(l.$, {
                                              variant: "outline",
                                              size: "sm",
                                              children: "Change Status",
                                            }),
                                            "active" === e.status &&
                                              (0, a.jsx)(l.$, {
                                                size: "sm",
                                                children: "Finalize Deal",
                                              }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                ],
              });
        }
      },
      19121: (e) => {
        "use strict";
        e.exports = require("next/dist/server/app-render/action-async-storage.external.js");
      },
      29294: (e) => {
        "use strict";
        e.exports = require("next/dist/server/app-render/work-async-storage.external.js");
      },
      33873: (e) => {
        "use strict";
        e.exports = require("path");
      },
      34729: (e, s, t) => {
        "use strict";
        t.d(s, { T: () => i });
        var a = t(60687),
          r = t(43210),
          n = t(96241);
        let i = r.forwardRef(({ className: e, ...s }, t) =>
          (0, a.jsx)("textarea", {
            className: (0, n.cn)(
              "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              e
            ),
            ref: t,
            ...s,
          })
        );
        i.displayName = "Textarea";
      },
      55146: (e, s, t) => {
        "use strict";
        t.d(s, { B8: () => S, UC: () => T, bL: () => I, l9: () => P });
        var a = t(43210),
          r = t(70569),
          n = t(11273),
          i = t(72942),
          l = t(46059),
          d = t(14163),
          o = t(43),
          c = t(65551),
          m = t(96963),
          x = t(60687),
          u = "Tabs",
          [p, h] = (0, n.A)(u, [i.RG]),
          f = (0, i.RG)(),
          [j, g] = p(u),
          v = a.forwardRef((e, s) => {
            let {
                __scopeTabs: t,
                value: a,
                onValueChange: r,
                defaultValue: n,
                orientation: i = "horizontal",
                dir: l,
                activationMode: p = "automatic",
                ...h
              } = e,
              f = (0, o.jH)(l),
              [g, v] = (0, c.i)({
                prop: a,
                onChange: r,
                defaultProp: n ?? "",
                caller: u,
              });
            return (0, x.jsx)(j, {
              scope: t,
              baseId: (0, m.B)(),
              value: g,
              onValueChange: v,
              orientation: i,
              dir: f,
              activationMode: p,
              children: (0, x.jsx)(d.sG.div, {
                dir: f,
                "data-orientation": i,
                ...h,
                ref: s,
              }),
            });
          });
        v.displayName = u;
        var b = "TabsList",
          N = a.forwardRef((e, s) => {
            let { __scopeTabs: t, loop: a = !0, ...r } = e,
              n = g(b, t),
              l = f(t);
            return (0, x.jsx)(i.bL, {
              asChild: !0,
              ...l,
              orientation: n.orientation,
              dir: n.dir,
              loop: a,
              children: (0, x.jsx)(d.sG.div, {
                role: "tablist",
                "aria-orientation": n.orientation,
                ...r,
                ref: s,
              }),
            });
          });
        N.displayName = b;
        var y = "TabsTrigger",
          w = a.forwardRef((e, s) => {
            let { __scopeTabs: t, value: a, disabled: n = !1, ...l } = e,
              o = g(y, t),
              c = f(t),
              m = k(o.baseId, a),
              u = R(o.baseId, a),
              p = a === o.value;
            return (0, x.jsx)(i.q7, {
              asChild: !0,
              ...c,
              focusable: !n,
              active: p,
              children: (0, x.jsx)(d.sG.button, {
                type: "button",
                role: "tab",
                "aria-selected": p,
                "aria-controls": u,
                "data-state": p ? "active" : "inactive",
                "data-disabled": n ? "" : void 0,
                disabled: n,
                id: m,
                ...l,
                ref: s,
                onMouseDown: (0, r.m)(e.onMouseDown, (e) => {
                  n || 0 !== e.button || !1 !== e.ctrlKey
                    ? e.preventDefault()
                    : o.onValueChange(a);
                }),
                onKeyDown: (0, r.m)(e.onKeyDown, (e) => {
                  [" ", "Enter"].includes(e.key) && o.onValueChange(a);
                }),
                onFocus: (0, r.m)(e.onFocus, () => {
                  let e = "manual" !== o.activationMode;
                  p || n || !e || o.onValueChange(a);
                }),
              }),
            });
          });
        w.displayName = y;
        var C = "TabsContent",
          D = a.forwardRef((e, s) => {
            let {
                __scopeTabs: t,
                value: r,
                forceMount: n,
                children: i,
                ...o
              } = e,
              c = g(C, t),
              m = k(c.baseId, r),
              u = R(c.baseId, r),
              p = r === c.value,
              h = a.useRef(p);
            return (
              a.useEffect(() => {
                let e = requestAnimationFrame(() => (h.current = !1));
                return () => cancelAnimationFrame(e);
              }, []),
              (0, x.jsx)(l.C, {
                present: n || p,
                children: ({ present: t }) =>
                  (0, x.jsx)(d.sG.div, {
                    "data-state": p ? "active" : "inactive",
                    "data-orientation": c.orientation,
                    role: "tabpanel",
                    "aria-labelledby": m,
                    hidden: !t,
                    id: u,
                    tabIndex: 0,
                    ...o,
                    ref: s,
                    style: {
                      ...e.style,
                      animationDuration: h.current ? "0s" : void 0,
                    },
                    children: t && i,
                  }),
              })
            );
          });
        function k(e, s) {
          return `${e}-trigger-${s}`;
        }
        function R(e, s) {
          return `${e}-content-${s}`;
        }
        D.displayName = C;
        var I = v,
          S = N,
          P = w,
          T = D;
      },
      55192: (e, s, t) => {
        "use strict";
        t.d(s, {
          BT: () => o,
          Wu: () => c,
          ZB: () => d,
          Zp: () => i,
          aR: () => l,
          wL: () => m,
        });
        var a = t(60687),
          r = t(43210),
          n = t(96241);
        let i = r.forwardRef(({ className: e, ...s }, t) =>
          (0, a.jsx)("div", {
            ref: t,
            className: (0, n.cn)(
              "rounded-xl border bg-card text-card-foreground shadow",
              e
            ),
            ...s,
          })
        );
        i.displayName = "Card";
        let l = r.forwardRef(({ className: e, ...s }, t) =>
          (0, a.jsx)("div", {
            ref: t,
            className: (0, n.cn)("flex flex-col space-y-1.5 p-6", e),
            ...s,
          })
        );
        l.displayName = "CardHeader";
        let d = r.forwardRef(({ className: e, ...s }, t) =>
          (0, a.jsx)("div", {
            ref: t,
            className: (0, n.cn)(
              "font-semibold leading-none tracking-tight",
              e
            ),
            ...s,
          })
        );
        d.displayName = "CardTitle";
        let o = r.forwardRef(({ className: e, ...s }, t) =>
          (0, a.jsx)("div", {
            ref: t,
            className: (0, n.cn)("text-sm text-muted-foreground", e),
            ...s,
          })
        );
        o.displayName = "CardDescription";
        let c = r.forwardRef(({ className: e, ...s }, t) =>
          (0, a.jsx)("div", {
            ref: t,
            className: (0, n.cn)("p-6 pt-0", e),
            ...s,
          })
        );
        c.displayName = "CardContent";
        let m = r.forwardRef(({ className: e, ...s }, t) =>
          (0, a.jsx)("div", {
            ref: t,
            className: (0, n.cn)("flex items-center p-6 pt-0", e),
            ...s,
          })
        );
        m.displayName = "CardFooter";
      },
      63033: (e) => {
        "use strict";
        e.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");
      },
      68505: (e, s, t) => {
        Promise.resolve().then(t.bind(t, 17569));
      },
      78148: (e, s, t) => {
        "use strict";
        t.d(s, { b: () => l });
        var a = t(43210),
          r = t(14163),
          n = t(60687),
          i = a.forwardRef((e, s) =>
            (0, n.jsx)(r.sG.label, {
              ...e,
              ref: s,
              onMouseDown: (s) => {
                s.target.closest("button, input, select, textarea") ||
                  (e.onMouseDown?.(s),
                  !s.defaultPrevented && s.detail > 1 && s.preventDefault());
              },
            })
          );
        i.displayName = "Label";
        var l = i;
      },
      80013: (e, s, t) => {
        "use strict";
        t.d(s, { J: () => o });
        var a = t(60687),
          r = t(43210),
          n = t(78148),
          i = t(24224),
          l = t(96241);
        let d = (0, i.F)(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          ),
          o = r.forwardRef(({ className: e, ...s }, t) =>
            (0, a.jsx)(n.b, { ref: t, className: (0, l.cn)(d(), e), ...s })
          );
        o.displayName = n.b.displayName;
      },
      85763: (e, s, t) => {
        "use strict";
        t.d(s, { Xi: () => o, av: () => c, j7: () => d, tU: () => l });
        var a = t(60687),
          r = t(43210),
          n = t(55146),
          i = t(96241);
        let l = n.bL,
          d = r.forwardRef(({ className: e, ...s }, t) =>
            (0, a.jsx)(n.B8, {
              ref: t,
              className: (0, i.cn)(
                "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
                e
              ),
              ...s,
            })
          );
        d.displayName = n.B8.displayName;
        let o = r.forwardRef(({ className: e, ...s }, t) =>
          (0, a.jsx)(n.l9, {
            ref: t,
            className: (0, i.cn)(
              "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
              e
            ),
            ...s,
          })
        );
        o.displayName = n.l9.displayName;
        let c = r.forwardRef(({ className: e, ...s }, t) =>
          (0, a.jsx)(n.UC, {
            ref: t,
            className: (0, i.cn)(
              "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              e
            ),
            ...s,
          })
        );
        c.displayName = n.UC.displayName;
      },
      88259: (e, s, t) => {
        "use strict";
        t.r(s),
          t.d(s, {
            GlobalError: () => i.a,
            __next_app__: () => m,
            pages: () => c,
            routeModule: () => x,
            tree: () => o,
          });
        var a = t(65239),
          r = t(48088),
          n = t(88170),
          i = t.n(n),
          l = t(30893),
          d = {};
        for (let e in l)
          0 >
            [
              "default",
              "tree",
              "pages",
              "GlobalError",
              "__next_app__",
              "routeModule",
            ].indexOf(e) && (d[e] = () => l[e]);
        t.d(s, d);
        let o = {
            children: [
              "",
              {
                children: [
                  "deal-room",
                  {
                    children: [
                      "[id]",
                      {
                        children: [
                          "__PAGE__",
                          {},
                          {
                            page: [
                              () => Promise.resolve().then(t.bind(t, 92659)),
                              "/Users/mac/Downloads/VentureHiveIntelligence/src/app/deal-room/[id]/page.tsx",
                            ],
                          },
                        ],
                      },
                      {},
                    ],
                  },
                  {},
                ],
              },
              {
                layout: [
                  () => Promise.resolve().then(t.bind(t, 94431)),
                  "/Users/mac/Downloads/VentureHiveIntelligence/src/app/layout.tsx",
                ],
                "not-found": [
                  () => Promise.resolve().then(t.t.bind(t, 57398, 23)),
                  "next/dist/client/components/not-found-error",
                ],
                forbidden: [
                  () => Promise.resolve().then(t.t.bind(t, 89999, 23)),
                  "next/dist/client/components/forbidden-error",
                ],
                unauthorized: [
                  () => Promise.resolve().then(t.t.bind(t, 65284, 23)),
                  "next/dist/client/components/unauthorized-error",
                ],
              },
            ],
          }.children,
          c = [
            "/Users/mac/Downloads/VentureHiveIntelligence/src/app/deal-room/[id]/page.tsx",
          ],
          m = { require: t, loadChunk: () => Promise.resolve() },
          x = new a.AppPageRouteModule({
            definition: {
              kind: r.RouteKind.APP_PAGE,
              page: "/deal-room/[id]/page",
              pathname: "/deal-room/[id]",
              bundlePath: "",
              filename: "",
              appPaths: [],
            },
            userland: { loaderTree: o },
          });
      },
      89667: (e, s, t) => {
        "use strict";
        t.d(s, { p: () => i });
        var a = t(60687),
          r = t(43210),
          n = t(96241);
        let i = r.forwardRef(({ className: e, type: s, ...t }, r) =>
          (0, a.jsx)("input", {
            type: s,
            className: (0, n.cn)(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              e
            ),
            ref: r,
            ...t,
          })
        );
        i.displayName = "Input";
      },
      92659: (e, s, t) => {
        "use strict";
        t.r(s), t.d(s, { default: () => a });
        let a = (0, t(12907).registerClientReference)(
          function () {
            throw Error(
              "Attempted to call the default export of \"/Users/mac/Downloads/VentureHiveIntelligence/src/app/deal-room/[id]/page.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
            );
          },
          "/Users/mac/Downloads/VentureHiveIntelligence/src/app/deal-room/[id]/page.tsx",
          "default"
        );
      },
      97881: (e, s, t) => {
        Promise.resolve().then(t.bind(t, 92659));
      },
    });
  var s = require("../../../webpack-runtime.js");
  s.C(e);
  var t = (e) => s((s.s = e)),
    a = s.X(0, [4447, 6509, 5560, 6921], () => t(88259));
  module.exports = a;
})();
