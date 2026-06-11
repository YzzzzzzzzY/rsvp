const RSVP_FORM_CONFIG = {
    action: 'https://docs.google.com/forms/d/e/1FAIpQLSek3O0Ta8dYN3tGK3NvSJUkrFExTW_OPvDdD_7Rm3ABGWyptQ/formResponse',
    fields: {
        yourName: 'entry.1059864759',
        partnerName: 'entry.2020307388',
        attending: 'entry.1219232297',
        notes: 'entry.1942269536'
    }
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

function scrollToRsvpForm() {
    const formSection = document.getElementById('form-section');
    if (!formSection) return;

    const isPhone = window.matchMedia('(max-width: 600px)').matches;
    if (!isPhone) {
        formSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        return;
    }

    const targetY = Math.max(
        0,
        formSection.offsetTop + formSection.offsetHeight - window.innerHeight
    );
    window.scrollTo({
        top: targetY,
        behavior: 'smooth'
    });
}

function bindGoogleFormFields(form) {
    const { action, fields } = RSVP_FORM_CONFIG;

    form.action = action;
    document.getElementById('yourName').name = fields.yourName;

    form.querySelectorAll('input[name="attending"]').forEach((radio) => {
        radio.name = fields.attending;
    });
}

function updateFullNameField(firstNameInput, lastNameInput, fullNameInput) {
    const fullName = [firstNameInput.value, lastNameInput.value]
        .map((value) => value.trim())
        .filter(Boolean)
        .join(' ');
    fullNameInput.value = fullName;
}

function isAttendingYes(form) {
    const attendingField = form.querySelector('input[type="radio"]:checked');
    return attendingField && attendingField.value === 'Yes';
}

function updatePartnerVisibility(bringingPartner, partnerGroup, partnerFirstNameInput, partnerLastNameInput, partnerInput, attending) {
    const showPartner = attending && bringingPartner.checked;
    partnerGroup.hidden = !showPartner;
    partnerFirstNameInput.required = showPartner;
    partnerLastNameInput.required = showPartner;

    if (showPartner) {
        partnerInput.name = RSVP_FORM_CONFIG.fields.partnerName;
    } else {
        partnerFirstNameInput.required = false;
        partnerLastNameInput.required = false;
        partnerFirstNameInput.value = '';
        partnerLastNameInput.value = '';
        partnerInput.removeAttribute('name');
        partnerInput.value = '';
    }
}

function updateAttendingDetails(form, attendingDetails, bringingPartner, partnerGroup, partnerFirstNameInput, partnerLastNameInput, partnerInput, notesInput) {
    const attending = isAttendingYes(form);
    attendingDetails.hidden = !attending;

    bringingPartner.checked = false;
    updatePartnerVisibility(bringingPartner, partnerGroup, partnerFirstNameInput, partnerLastNameInput, partnerInput, attending);

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
    const successGiftNote = document.getElementById('successGiftNote');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const fullNameInput = document.getElementById('yourName');
    const attendingDetails = document.getElementById('attendingDetails');
    const bringingPartner = document.getElementById('bringingPartner');
    const partnerGroup = document.getElementById('partnerGroup');
    const partnerFirstNameInput = document.getElementById('partnerFirstName');
    const partnerLastNameInput = document.getElementById('partnerLastName');
    const partnerInput = document.getElementById('partnerName');
    const notesInput = document.getElementById('notes');
    const attendingRadios = form.querySelectorAll('input[name="attending"]');

    bindGoogleFormFields(form);

    attendingRadios.forEach((radio) => {
        radio.addEventListener('change', () => {
            updateAttendingDetails(form, attendingDetails, bringingPartner, partnerGroup, partnerFirstNameInput, partnerLastNameInput, partnerInput, notesInput);
        });
    });

    bringingPartner.addEventListener('change', () => {
        updatePartnerVisibility(bringingPartner, partnerGroup, partnerFirstNameInput, partnerLastNameInput, partnerInput, isAttendingYes(form));
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

    const scrollButtons = document.querySelectorAll('.scroll-button');
    scrollButtons.forEach((scrollButton) => {
        scrollButton.addEventListener('mouseenter', () => {
            scrollButton.style.transform = 'translateY(-3px) scale(1.02)';
        });
        scrollButton.addEventListener('mouseleave', () => {
            scrollButton.style.transform = 'translateY(0) scale(1)';
        });
    });

    form.addEventListener('submit', function() {
        const attending = isAttendingYes(form);
        updateFullNameField(firstNameInput, lastNameInput, fullNameInput);
        updateFullNameField(partnerFirstNameInput, partnerLastNameInput, partnerInput);

        if (!attending) {
            bringingPartner.checked = false;
            partnerFirstNameInput.value = '';
            partnerLastNameInput.value = '';
            partnerInput.removeAttribute('name');
            partnerInput.value = '';
            notesInput.removeAttribute('name');
            notesInput.value = '';
            successText.textContent = "Thank you for letting us know. We'll miss you!";
            successGiftNote.hidden = false;
        } else {
            successText.textContent = "We've received your RSVP and can't wait to celebrate with you.";
            successGiftNote.hidden = false;
        }

        const btnText = form.querySelector('.btn-text');
        const btnLoading = form.querySelector('.btn-loading');

        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';

        setTimeout(() => {
            if (attending) {
                window.location.href = 'gifts.html?rsvp=yes';
                return;
            }

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
