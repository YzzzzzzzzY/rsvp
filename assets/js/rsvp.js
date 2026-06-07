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
    }
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
    const attendingRadios = form.querySelectorAll('input[name="attending"]');

    bindGoogleFormFields(form);

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
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.info-section, .scatter, .letter-block, .form-section').forEach((section) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(18px)';
        section.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        observer.observe(section);
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
            successText.textContent = "Thank you for letting us know. We'll miss you!";
        } else {
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
