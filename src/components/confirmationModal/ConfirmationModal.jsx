import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import "./ConfirmationModal.css";

/**
 * Un modal de confirmación reutilizable.
 */
const ConfirmationModal = ({
  show,
  onHide,
  onConfirm,
  title,
  body,
  isConfirming = false,
  confirmButtonText = "Confirmar",
  cancelButtonText = "Cancelar",
  confirmButtonVariant = "primary",
  customContentClass = "",
  error = null,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      contentClassName={customContentClass}
    >
      <Modal.Header
        closeButton
        className={customContentClass ? "modal-header-custom" : ""}
      >
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {body}
        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isConfirming}>
          {cancelButtonText}
        </Button>
        <Button
          variant={confirmButtonVariant}
          onClick={onConfirm}
          disabled={isConfirming}
        >
          {isConfirming ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="ms-2">Procesando...</span>
            </>
          ) : (
            confirmButtonText
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
