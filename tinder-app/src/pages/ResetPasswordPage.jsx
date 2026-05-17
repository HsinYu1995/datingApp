import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../api/axiosInstance';
import './auth.css';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch('newPassword');

  async function onSubmit({ newPassword }) {
    setServerError('');
    try {
      await api.post('/reset-password', { token, newPassword });
      setSuccess(true);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Invalid or expired reset link.');
    }
  }

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">🔥 Spark</div>
          <div className="auth-server-error">Invalid reset link.</div>
          <p className="auth-footer"><Link to="/forgot-password">Request a new one</Link></p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🔥 Spark</div>
        <h1 className="auth-title">New password</h1>
        <p className="auth-subtitle">Choose a strong password</p>

        {success ? (
          <>
            <div className="auth-success">Password updated successfully!</div>
            <p className="auth-footer"><Link to="/login">Sign in</Link></p>
          </>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="auth-field">
              <label>New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className={errors.newPassword ? 'input-error' : ''}
                {...register('newPassword', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                })}
              />
              {errors.newPassword && (
                <span className="field-error">{errors.newPassword.message}</span>
              )}
            </div>

            <div className="auth-field">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className={errors.confirmPassword ? 'input-error' : ''}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === password || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword.message}</span>
              )}
            </div>

            {serverError && <div className="auth-server-error">{serverError}</div>}

            <button type="submit" className="auth-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating…' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
