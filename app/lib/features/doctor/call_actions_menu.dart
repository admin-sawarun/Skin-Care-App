import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/constants/app_colors.dart';
import '../../data/api/api_client.dart';
import '../../data/api/api_repository.dart';
import '../../data/models/appointment_model.dart';

/// ⋮ next to a doctor's scheduled call: mark it done (it happened but the
/// app never closed it) or remove it (it never happened).
class CallActionsMenu extends ConsumerWidget {
  final AppointmentModel appointment;
  const CallActionsMenu({super.key, required this.appointment});

  Future<void> _run(BuildContext context, WidgetRef ref, String action) async {
    final repo = ref.read(apiRepositoryProvider);
    final messenger = ScaffoldMessenger.of(context);
    if (action == 'remove') {
      final ok = await showDialog<bool>(
        context: context,
        builder: (c) => AlertDialog(
          title: const Text('Remove this call?'),
          content: Text('The call with ${appointment.patientOrDoctorName} will be removed from your schedule.'),
          actions: [
            TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('Cancel')),
            TextButton(
              onPressed: () => Navigator.pop(c, true),
              child: const Text('Remove', style: TextStyle(color: AppColors.error)),
            ),
          ],
        ),
      );
      if (ok != true) return;
    }
    try {
      if (action == 'complete') {
        await repo.completeAppointment(appointment.id);
        messenger.showSnackBar(const SnackBar(content: Text('Call marked as completed')));
      } else {
        await repo.removeAppointment(appointment.id);
        messenger.showSnackBar(const SnackBar(content: Text('Call removed')));
      }
    } catch (e) {
      messenger.showSnackBar(SnackBar(content: Text(apiErrorMessage(e))));
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return PopupMenuButton<String>(
      tooltip: 'More',
      icon: const Icon(Icons.more_vert_rounded, color: AppColors.textMuted),
      onSelected: (v) => _run(context, ref, v),
      itemBuilder: (_) => const [
        PopupMenuItem(value: 'complete', child: Text('Mark as completed')),
        PopupMenuItem(value: 'remove', child: Text('Remove call', style: TextStyle(color: AppColors.error))),
      ],
    );
  }
}
