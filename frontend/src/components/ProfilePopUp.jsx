import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/*
 ProfilePopUp.jsx
 - Ao montar, conecta-se ao botão com a classe "button-profile" (no HeaderProfile.jsx).
 - Alterna a visibilidade ao clicar no botão e fecha ao clicar fora ou apertar Escape.
 - Posiciona-se abaixo do botão usando getBoundingClientRect.
 - Export default para ser importado e incluído (por exemplo) no HeaderProfile ou no topo da app.
*/

export default function ProfilePopUp() {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });
    const popupRef = useRef(null);

    useEffect(() => {
        const btn = document.querySelector(".button-profile");
        if (!btn) return;

        const toggle = (e) => {
            e.stopPropagation();
            const rect = btn.getBoundingClientRect();
            setPos({
                top: rect.bottom + window.scrollY + 8, // 8px abaixo do botão
                left: rect.left + window.scrollX,
            });
            setOpen((v) => !v);
        };

        btn.addEventListener("click", toggle);
        return () => btn.removeEventListener("click", toggle);
    }, []);

    useEffect(() => {
        if (!open) return;

        const onDocClick = (e) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(e.target) &&
                !e.target.closest(".button-profile")
            ) {
                setOpen(false);
            }
        };
        const onEsc = (e) => {
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", onDocClick);
        document.addEventListener("keydown", onEsc);
        return () => {
            document.removeEventListener("mousedown", onDocClick);
            document.removeEventListener("keydown", onEsc);
        };
    }, [open]);

    if (!open) return null;

    const popupStyle = {
        position: "absolute",
        top: pos.top,
        left: pos.left,
        minWidth: 200,
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: 8,
        boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
        padding: 8,
        zIndex: 1000,
    };

    const itemStyle = {
        background: "none",
        border: "none",
        textAlign: "left",
        padding: "8px 12px",
        width: "100%",
        cursor: "pointer",
    };

    return createPortal(
        <div ref={popupRef} style={popupStyle} role="dialog" aria-modal="true">
            <button style={itemStyle} onClick={() => {/* navegar para perfil */}}>
                Ver perfil
            </button>
            <button style={itemStyle} onClick={() => {/* abrir configurações */}}>
                Configurações
            </button>
            <hr style={{ margin: "8px 0", border: "none", borderTop: "1px solid #eee" }} />
            <button
                style={{ ...itemStyle, color: "#d32f2f" }}
                onClick={() => {/* ação de logout */}}
            >
                Sair
            </button>
        </div>,
        document.body
    );
}