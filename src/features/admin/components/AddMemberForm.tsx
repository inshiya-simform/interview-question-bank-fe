import { Button, TextField } from '@/components';
import { ADMIN_COPY, STAFF_ROLES } from '@/constants';
import { useAddMemberForm } from '../hooks/useAddMemberForm';
import { RoleOption } from './RoleOption';
import './AddMemberForm.css';

export function AddMemberForm() {
  const { values, errors, handleChange, handleSubmit, reset, isPending } = useAddMemberForm();

  return (
    <form className="member-form" onSubmit={handleSubmit} noValidate>
      <TextField
        label={ADMIN_COPY.FIELD_EMAIL}
        name="email"
        type="email"
        autoComplete="off"
        placeholder={ADMIN_COPY.PLACEHOLDER_EMAIL}
        hint={ADMIN_COPY.HINT_EMAIL}
        value={values.email}
        onChange={handleChange}
        error={errors.email}
      />
      <fieldset className="member-form__roles">
        <legend className="member-form__legend">{ADMIN_COPY.FIELD_ROLE}</legend>
        {STAFF_ROLES.map((role) => (
          <RoleOption
            key={role}
            role={role}
            checked={values.role === role}
            onChange={handleChange}
          />
        ))}
        {errors.role && <p className="member-form__error">{errors.role}</p>}
      </fieldset>
      <div className="member-form__actions">
        <Button variant="secondary" onClick={reset} disabled={isPending}>
          {ADMIN_COPY.CLEAR}
        </Button>
        <Button type="submit" isLoading={isPending}>
          {isPending ? ADMIN_COPY.SUBMITTING : ADMIN_COPY.SUBMIT}
        </Button>
      </div>
    </form>
  );
}
