const RSVP_FORM_CONFIG = {
    action: 'https://docs.google.com/forms/d/e/1FAIpQLSek3O0Ta8dYN3tGK3NvSJUkrFExTW_OPvDdD_7Rm3ABGWyptQ/formResponse',
    fields: {
        yourName: 'entry.253243517',
        partnerName: 'entry.407071966',
        attending: 'entry.1291323824',
        notes: 'entry.206253920'
    },
    fbzx: '4587660607938263854',
    partialResponse: '[null,null,"4587660607938263854"]'
};

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function scrollToForm() {
    scrollToSection('form-section');
}

function bindGoogleFormFields(form) {
    const { action, fields, fbzx, partialResponse } = RSVP_FORM_CONFIG;

    form.action = action;
    document.getElementById('yourName').name = fields.yourName;

    form.querySelectorAll('input[name="attending"]').forEach((radio) => {
        radio.name = fields.attending;
    });

    let fbzxInput = form.querySelector('input[name="fbzx"]');
    if (!fbzxInput) {
        fbzxInput = document.createElement('input');
        fbzxInput.type = 'hidden';
        fbzxInput.name = 'fbzx';
        form.appendChild(fbzxInput);
    }
    fbzxInput.value = fbzx;

    let partialInput = form.querySelector('input[name="partialResponse"]');
    if (!partialInput) {
        partialInput = document.createElement('input');
        partialInput.type = 'hidden';
        partialInput.name = 'partialResponse';
        form.appendChild(partialInput);
    }
    partialInput.value = partialResponse;
}

function isAttendingYes(form) {
    const attendingField = form.querySelector('input[type="radio"]:checked');
    return attendingField && attendingField.value === 'Yes';
}

function updatePartnerVisibility(bringingPartner, partnerGroup, partnerInput, attending) {
    const showPartner = attending && bringingPartner.checked;
    partnerGroup.hidden = !showPartner;
    partnerInput.required = showPartner;

    if (showPartner) {
        partnerInput.name = RSVP_FORM_CONFIG.fields.partnerName;
    } else {
        partnerInput.removeAttribute('name');
        partnerInput.value = '';
    }
}

function getSelectedDrinkPrefs() {
    return ['prefAgave', 'prefSylva', 'prefSurprise']
        .map((id) => document.getElementById(id))
        .filter((input) => input && input.checked)
        .map((input) => input.value);
}

function updateCardSelectedState() {
    document.querySelectorAll('.cocktail-card').forEach((card) => {
        const checkboxId = card.dataset.drinkCheckbox;
        const checkbox = checkboxId ? document.getElementById(checkboxId) : null;
        card.classList.toggle('is-selected', !!(checkbox && checkbox.checked));
    });
}

function clearDrinkPrefs() {
    ['prefAgave', 'prefSylva', 'prefSurprise'].forEach((id) => {
        const input = document.getElementById(id);
        if (input) {
            input.checked = false;
        }
    });
    updateCardSelectedState();
}

function updateAttendingDetails(form, attendingDetails, bringingPartner, partnerGroup, partnerInput, notesInput) {
    const attending = isAttendingYes(form);
    attendingDetails.hidden = !attending;

    bringingPartner.checked = false;
    updatePartnerVisibility(bringingPartner, partnerGroup, partnerInput, attending);

    if (attending) {
        notesInput.name = RSVP_FORM_CONFIG.fields.notes;
    } else {
        notesInput.removeAttribute('name');
        notesInput.value = '';
        clearDrinkPrefs();
    }
}

function setupDrinkPreferenceLogic(prefAgave, prefSylva, prefSurprise) {
    const signaturePrefs = [prefAgave, prefSylva];

    signaturePrefs.forEach((input) => {
        input.addEventListener('change', () => {
            if (input.checked) {
                prefSurprise.checked = false;
            }
            updateCardSelectedState();
        });
    });

    prefSurprise.addEventListener('change', () => {
        if (prefSurprise.checked) {
            signaturePrefs.forEach((input) => {
                input.checked = false;
            });
        }
        updateCardSelectedState();
    });

    document.querySelectorAll('.cocktail-card').forEach((card) => {
        const toggleCard = () => {
            scrollToSection('form-section');

            const checkboxId = card.dataset.drinkCheckbox;
            const checkbox = checkboxId ? document.getElementById(checkboxId) : null;
            const attendingDetails = document.getElementById('attendingDetails');

            if (!checkbox || attendingDetails.hidden) {
                return;
            }

            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
        };

        card.addEventListener('click', toggleCard);
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleCard();
            }
        });
    });
}

function buildNotesPayload(notesInput) {
    const baseNotes = notesInput.value.trim();
    const drinkPrefs = getSelectedDrinkPrefs();

    if (!drinkPrefs.length) {
        return baseNotes;
    }

    const drinkLine = `Drink preferences: ${drinkPrefs.join('; ')}`;
    return baseNotes ? `${baseNotes}\n\n${drinkLine}` : drinkLine;
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('rsvpForm');
    const successMessage = document.getElementById('successMessage');
    const successText = document.getElementById('successText');
    const attendingDetails = document.getElementById('attendingDetails');
    const bringingPartner = document.getElementById('bringingPartner');
    const partnerGroup = document.getElementById('partnerGroup');
    const partnerInput = document.getElementById('partnerName');
    const notesInput = document.getElementById('notes');
    const prefAgave = document.getElementById('prefAgave');
    const prefSylva = document.getElementById('prefSylva');
    const prefSurprise = document.getElementById('prefSurprise');
    const attendingRadios = form.querySelectorAll('input[name="attending"]');

    bindGoogleFormFields(form);
    setupDrinkPreferenceLogic(prefAgave, prefSylva, prefSurprise);

    attendingRadios.forEach((radio) => {
        radio.addEventListener('change', () => {
            updateAttendingDetails(form, attendingDetails, bringingPartner, partnerGroup, partnerInput, notesInput);
        });
    });

    bringingPartner.addEventListener('change', () => {
        updatePartnerVisibility(bringingPartner, partnerGroup, partnerInput, isAttendingYes(form));
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.expand-panel, .rsvp-intro, .drinks-section, .form-section').forEach((section) => {
        observer.observe(section);
    });

    document.querySelectorAll('.expand-panel').forEach((panel) => {
        panel.addEventListener('toggle', () => {
            if (!panel.open) {
                return;
            }
            document.querySelectorAll('.expand-panel').forEach((other) => {
                if (other !== panel) {
                    other.open = false;
                }
            });
        });
    });

    const scrollButton = document.querySelector('.scroll-button');
    if (scrollButton) {
        scrollButton.addEventListener('mouseenter', () => {
            scrollButton.style.transform = 'translateY(-3px) scale(1.02)';
        });
        scrollButton.addEventListener('mouseleave', () => {
            scrollButton.style.transform = 'translateY(0) scale(1)';
        });
    }

    form.addEventListener('submit', function() {
        if (!isAttendingYes(form)) {
            bringingPartner.checked = false;
            partnerInput.removeAttribute('name');
            partnerInput.value = '';
            notesInput.removeAttribute('name');
            notesInput.value = '';
            clearDrinkPrefs();
            successText.textContent = "Thank you for letting us know. We'll miss you!";
        } else {
            notesInput.value = buildNotesPayload(notesInput);
            successText.textContent = "We've received your RSVP and can't wait to celebrate with you.";
        }

        const btnText = form.querySelector('.btn-text');
        const btnLoading = form.querySelector('.btn-loading');

        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';

        setTimeout(() => {
            form.style.display = 'none';
            successMessage.style.display = 'block';
        }, 1500);
    });

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translate3d(0, ${scrolled * -0.5}px, 0)`;
        }
    });
});
