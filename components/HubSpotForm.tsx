import React, { useEffect } from 'react';

declare global {
  interface Window {
    hbspt: any;
  }
}

interface HubSpotFormProps {
  requirement?: string;
  price?: string;
}

const HubSpotForm: React.FC<HubSpotFormProps> = ({ requirement, price }) => {
  useEffect(() => {
    const initForm = () => {
      if (window.hbspt) {
        // Clear target container before rendering to prevent duplication issues
        const container = document.getElementById('formador-40-form');
        if (container) {
          container.innerHTML = '';
        }

        window.hbspt.forms.create({
          portalId: "7817128",
          formId: "ca7a1c90-aed4-4f2a-8d9a-bbce8fdcb8a8",
          target: '#formador-40-form',
          values: {
            // Requerimiento / Curso Fields
            requerimiento: requirement || '',
            requerimiento_o_curso: requirement || '',
            curso: requirement || '',
            curso_interesado: requirement || '',
            programa_interes: requirement || '',
            plan_seleccionado: requirement || '',
            plan_elegido: requirement || '',
            requerimiento_b2b: requirement || '',
            requerimiento_de_capacitacion: requirement || '',
            de_que_se_trata: requirement || '',
            
            // Pricing Fields
            precio: price || '',
            precio_ofrecido: price || '',
            costo: price || '',
            inversion: price || '',
            inversion_estimada: price || '',
            tarifa: price || '',
            
            // Native Message / Comments Fields
            message: `CURSO O REQUERIMIENTO INTERESADO:\n👉 ${requirement || 'Ruta Completa - Instructor 4.0'}\n\nPRECIO OFRECIDO:\n👉 ${price || '$67,660 MXN'}`,
            comentarios: `CURSO O REQUERIMIENTO INTERESADO:\n👉 ${requirement || 'Ruta Completa - Instructor 4.0'}\n\nPRECIO OFRECIDO:\n👉 ${price || '$67,660 MXN'}`,
            comentarios___notas: `CURSO O REQUERIMIENTO INTERESADO:\n👉 ${requirement || 'Ruta Completa - Instructor 4.0'}\n\nPRECIO OFRECIDO:\n👉 ${price || '$67,660 MXN'}`,
            comentarios_adicionales: `CURSO O REQUERIMIENTO INTERESADO:\n👉 ${requirement || 'Ruta Completa - Instructor 4.0'}\n\nPRECIO OFRECIDO:\n👉 ${price || '$67,660 MXN'}`,
            notas: `CURSO O REQUERIMIENTO INTERESADO:\n👉 ${requirement || 'Ruta Completa - Instructor 4.0'}\n\nPRECIO OFRECIDO:\n👉 ${price || '$67,660 MXN'}`,
            mensaje: `CURSO O REQUERIMIENTO INTERESADO:\n👉 ${requirement || 'Ruta Completa - Instructor 4.0'}\n\nPRECIO OFRECIDO:\n👉 ${price || '$67,660 MXN'}`
          },
          onFormReady: ($form: any) => {
            const formEl = $form[0] || $form;
            
            // Format prefilled text block for notes/comments/message textareas
            const reqText = `CURSO O REQUERIMIENTO INTERESADO:\n👉 ${requirement || 'Ruta Completa - Instructor 4.0'}\n\nPRECIO OFRECIDO:\n👉 ${price || '$67,660 MXN'}\n\n`;

            const applyPrefills = () => {
              // 1. Fill and update textareas
              const textareas = formEl.querySelectorAll('textarea');
              textareas.forEach((textarea: any) => {
                const currentVal = textarea.value || '';
                if (!currentVal.includes("CURSO O REQUERIMIENTO")) {
                  textarea.value = reqText + currentVal;
                  textarea.dispatchEvent(new Event('input', { bubbles: true }));
                  textarea.dispatchEvent(new Event('change', { bubbles: true }));
                  textarea.dispatchEvent(new Event('blur', { bubbles: true }));
                }
              });

              // 2. Map and set values for inputs/selects by common names
              const fieldSelectors = [
                'requerimiento', 'requerimiento_o_curso', 'curso', 'curso_interesado',
                'programa_interes', 'plan_seleccionado', 'plan_elegido', 'requerimiento_b2b',
                'requerimiento_de_capacitacion', 'de_que_se_trata', 'precio', 'precio_ofrecido',
                'costo', 'inversion', 'inversion_estimada', 'tarifa'
              ];

              fieldSelectors.forEach(name => {
                const elements = formEl.querySelectorAll(`input[name="${name}"], textarea[name="${name}"], select[name="${name}"]`);
                elements.forEach((el: any) => {
                  const targetVal = name.includes('precio') || name.includes('costo') || name.includes('inversion') || name.includes('tarifa')
                    ? (price || '') 
                    : (requirement || '');
                  
                  if (el.value !== targetVal) {
                    el.value = targetVal;
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                    el.dispatchEvent(new Event('blur', { bubbles: true }));
                  }
                });
              });
            };

            // Run prefilling operations multiple times to handle asynchronous React/Hubspot renders
            applyPrefills();
            const intervals = [300, 800, 1500, 3000];
            intervals.forEach(time => {
              setTimeout(applyPrefills, time);
            });
          }
        });
      }
    };

    if (window.hbspt) {
      initForm();
    } else {
      const script = document.createElement('script');
      script.src = 'https://js.hsforms.net/forms/v2.js';
      script.async = true;
      script.addEventListener('load', initForm);
      document.body.appendChild(script);

      return () => {
        script.removeEventListener('load', initForm);
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [requirement, price]);

  return (
    <div className="w-full max-w-lg mx-auto p-2 bg-white rounded-xl">
        <p className="text-[10px] text-gray-400 font-extrabold uppercase text-center tracking-[0.2em] mb-4">
          Cargando formulario y prellenando con tu cotización...
        </p>
        <div id="formador-40-form"></div>
    </div>
  );
};

export default HubSpotForm;
